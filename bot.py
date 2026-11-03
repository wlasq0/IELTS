import asyncio
import json
import os
import random
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

from aiogram import Bot, Dispatcher, F
from aiogram.exceptions import TelegramForbiddenError
from aiogram.filters import Command, CommandStart
from aiogram.types import (
    CallbackQuery,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    MenuButtonWebApp,
    Message,
    WebAppInfo,
)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

TOKEN = os.getenv("BOT_TOKEN")
# Адрес Mini App (публичная ссылка, не секрет). Можно переопределить через WEBAPP_URL.
WEBAPP_URL = os.getenv("WEBAPP_URL") or "https://wlasq0.github.io/IELTS/"

if not TOKEN:
    raise SystemExit("Заполни BOT_TOKEN (в .env или в переменных окружения)")

HERE = Path(__file__).parent


def load_words():
    """Читает фразы из words.js (он лежит рядом и нужен для Mini App)."""
    text = (HERE / "words.js").read_text(encoding="utf-8")
    start = text.index("const T=") + len("const T=")
    end = text.index(";\nconst WORDS")
    topics = json.loads(text[start:end])
    return [
        {"topic": topic, "en": en, "ru": ru}
        for topic, items in topics
        for en, ru in items
    ]


WORDS = load_words()

bot = Bot(TOKEN)
dp = Dispatcher()

# Напоминания. Время по Новосибирску: UTC+7, без перехода на летнее время.
NSK = timezone(timedelta(hours=7))
REMIND_TIMES = [(14, 0), (21, 0)]
REMIND_TEXT = "Time for your IELTS practice."
ACTIVE_WINDOW = 2 * 60 * 60  # не напоминать, если пользователь писал боту за последние 2 часа

# Файлы на сервере, в репозиторий не попадают
SUBS_FILE = HERE / "subscribers.json"  # кто нажал /start
ACTIVITY_FILE = HERE / "activity.json"  # chat_id -> время последнего сообщения
PENDING_FILE = HERE / "reminders.json"  # chat_id -> id напоминаний, которые ещё не убраны


def load_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, ValueError):
        return default


def save_json(path: Path, data) -> None:
    path.write_text(json.dumps(data), encoding="utf-8")


SUBS = set(load_json(SUBS_FILE, []))
ACTIVITY = {int(k): float(v) for k, v in load_json(ACTIVITY_FILE, {}).items()}
PENDING = {int(k): v for k, v in load_json(PENDING_FILE, {}).items()}


def open_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="Открыть тренажёр", web_app=WebAppInfo(url=WEBAPP_URL))]]
    )


def seen_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="Got it", callback_data="seen")]])


def next_reminder(now: datetime) -> datetime:
    slots = []
    for hour, minute in REMIND_TIMES:
        slot = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
        if slot <= now:
            slot += timedelta(days=1)
        slots.append(slot)
    return min(slots)


async def send_reminders(now: float = None):
    now = time.time() if now is None else now
    for chat_id in list(SUBS):
        if now - ACTIVITY.get(chat_id, 0) <= ACTIVE_WINDOW:
            continue  # пользователь недавно писал в чат
        try:
            msg = await bot.send_message(chat_id, REMIND_TEXT, reply_markup=seen_kb())
            PENDING.setdefault(chat_id, []).append(msg.message_id)
        except TelegramForbiddenError:
            SUBS.discard(chat_id)  # пользователь заблокировал бота
            save_json(SUBS_FILE, sorted(SUBS))
        except Exception:
            pass
    save_json(PENDING_FILE, PENDING)


async def reminder_loop():
    while True:
        now = datetime.now(NSK)
        await asyncio.sleep((next_reminder(now) - now).total_seconds())
        await send_reminders()
        await asyncio.sleep(1)


def touch(chat_id: int) -> None:
    ACTIVITY[chat_id] = time.time()
    save_json(ACTIVITY_FILE, ACTIVITY)


@dp.callback_query(F.data == "seen")
async def seen(c: CallbackQuery):
    """Кнопка «Got it»: убираем это напоминание и все прошлые, которые не были убраны."""
    chat_id = c.message.chat.id
    ids = set(PENDING.pop(chat_id, [])) | {c.message.message_id}
    save_json(PENDING_FILE, PENDING)
    for message_id in ids:
        try:
            await bot.delete_message(chat_id, message_id)
        except Exception:
            pass  # уже удалено или старше 48 часов
    await c.answer()


@dp.message(CommandStart())
async def start(m: Message):
    touch(m.chat.id)
    SUBS.add(m.chat.id)
    save_json(SUBS_FILE, sorted(SUBS))
    await bot.set_chat_menu_button(
        chat_id=m.chat.id,
        menu_button=MenuButtonWebApp(text="Учить", web_app=WebAppInfo(url=WEBAPP_URL)),
    )
    await m.answer(
        "This bot helps you prepare for IELTS. Tap the button below to start.",
        reply_markup=open_kb(),
    )


@dp.message(Command("word"))
async def word(m: Message):
    touch(m.chat.id)
    w = random.choice(WORDS)
    await m.answer(f"{w['en']}\n{w['ru']}\n\nТема: {w['topic']}", reply_markup=open_kb())


@dp.message()
async def any_message(m: Message):
    touch(m.chat.id)  # любое сообщение откладывает напоминание (ответа нет)


async def main():
    reminders = asyncio.create_task(reminder_loop())
    try:
        await dp.start_polling(bot)
    finally:
        reminders.cancel()


if __name__ == "__main__":
    asyncio.run(main())
