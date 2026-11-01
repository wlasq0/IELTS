import asyncio
import json
import os
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

from aiogram import Bot, Dispatcher
from aiogram.exceptions import TelegramForbiddenError
from aiogram.filters import Command, CommandStart
from aiogram.types import (
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


def load_words():
    """Читает фразы из words.js (он лежит рядом и нужен для Mini App)."""
    text = (Path(__file__).parent / "words.js").read_text(encoding="utf-8")
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

# Напоминания. Время по Новосибирску: UTC+7 (MSK+4), без перехода на летнее время.
NSK = timezone(timedelta(hours=7))
REMIND_TIMES = [(14, 0), (20, 0)]
REMIND_TEXT = "Reminder: time to practise for IELTS!"
SUBS_FILE = Path(__file__).parent / "subscribers.json"


def load_subs() -> set:
    try:
        return set(json.loads(SUBS_FILE.read_text(encoding="utf-8")))
    except (FileNotFoundError, ValueError):
        return set()


def save_subs(subs: set) -> None:
    SUBS_FILE.write_text(json.dumps(sorted(subs)), encoding="utf-8")


SUBS = load_subs()


def next_reminder(now: datetime) -> datetime:
    slots = []
    for hour, minute in REMIND_TIMES:
        slot = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
        if slot <= now:
            slot += timedelta(days=1)
        slots.append(slot)
    return min(slots)


async def send_reminders():
    for chat_id in list(SUBS):
        try:
            await bot.send_message(chat_id, REMIND_TEXT, reply_markup=open_kb())
        except TelegramForbiddenError:
            SUBS.discard(chat_id)  # пользователь заблокировал бота
            save_subs(SUBS)
        except Exception:
            pass


async def reminder_loop():
    while True:
        now = datetime.now(NSK)
        await asyncio.sleep((next_reminder(now) - now).total_seconds())
        await send_reminders()
        await asyncio.sleep(1)


def open_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="Открыть тренажёр", web_app=WebAppInfo(url=WEBAPP_URL))]]
    )


@dp.message(CommandStart())
async def start(m: Message):
    SUBS.add(m.chat.id)
    save_subs(SUBS)
    await bot.set_chat_menu_button(
        chat_id=m.chat.id,
        menu_button=MenuButtonWebApp(text="Учить", web_app=WebAppInfo(url=WEBAPP_URL)),
    )
    await m.answer(
        "Hi! This is a bot for IELTS preparation. Tap the button below to start.",
        reply_markup=open_kb(),
    )


@dp.message(Command("stop"))
async def stop(m: Message):
    SUBS.discard(m.chat.id)
    save_subs(SUBS)
    await m.answer("Reminders are off. Send /start to turn them on again.")


@dp.message(Command("word"))
async def word(m: Message):
    w = random.choice(WORDS)
    await m.answer(f"{w['en']}\n— {w['ru']}\n\nТема: {w['topic']}", reply_markup=open_kb())


async def main():
    reminders = asyncio.create_task(reminder_loop())
    try:
        await dp.start_polling(bot)
    finally:
        reminders.cancel()


if __name__ == "__main__":
    asyncio.run(main())
