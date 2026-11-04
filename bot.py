import asyncio
import json
import os
import random
import re
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlencode
from zoneinfo import ZoneInfo

from aiogram import Bot, Dispatcher, F
from aiogram.exceptions import TelegramForbiddenError
from aiogram.filters import Command, CommandStart
from aiogram.types import (
    CallbackQuery,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    KeyboardButton,
    MenuButtonWebApp,
    Message,
    ReplyKeyboardMarkup,
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

# Напоминания. По умолчанию 14:00 и 21:00 по UTC+7 (Новосибирск).
# Каждый может поставить своё время в Mini App: экран открывается кнопкой «Напоминания» под полем ввода.
DEFAULT_TIMES = ["14:00", "21:00"]
DEFAULT_OFFSET = 7 * 60  # минут от UTC
MAX_TIMES = 6
TIME_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
REMIND_TEXT = "Time for your IELTS practice."
ACTIVE_WINDOW = 2 * 60 * 60  # не напоминать, если пользователь писал боту за последние 2 часа

# Файлы на сервере, в репозиторий не попадают
SUBS_FILE = HERE / "subscribers.json"  # кто нажал /start
ACTIVITY_FILE = HERE / "activity.json"  # chat_id -> время последнего сообщения
PENDING_FILE = HERE / "reminders.json"  # chat_id -> id напоминаний, которые ещё не убраны
SETTINGS_FILE = HERE / "settings.json"  # chat_id -> {"times": [...], "tz": "Asia/Novosibirsk", "off": 420}


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
SETTINGS = {int(k): v for k, v in load_json(SETTINGS_FILE, {}).items()}
LAST_SENT = {}  # chat_id -> "ГГГГ-ММ-ДД ЧЧ:ММ" последнего напоминания, чтобы не прислать дважды за минуту


def user_times(chat_id: int) -> list:
    return SETTINGS.get(chat_id, {}).get("times", DEFAULT_TIMES)


def user_tz(chat_id: int):
    """Часовой пояс телефона: по имени (учитывает летнее время), иначе по сдвигу от UTC."""
    s = SETTINGS.get(chat_id, {})
    if s.get("tz"):
        try:
            return ZoneInfo(s["tz"])
        except Exception:
            pass
    return timezone(timedelta(minutes=s.get("off", DEFAULT_OFFSET)))


def tz_label(chat_id: int) -> str:
    off = int(datetime.now(user_tz(chat_id)).utcoffset().total_seconds() // 60)
    h, m = divmod(abs(off), 60)
    return f"UTC{'+' if off >= 0 else '-'}{h}" + (f":{m:02d}" if m else "")


def remind_kb(chat_id: int) -> ReplyKeyboardMarkup:
    """Кнопка под полем ввода. Только из неё Mini App может отправить боту данные (sendData)."""
    url = WEBAPP_URL + ("&" if "?" in WEBAPP_URL else "?") + urlencode({"s": "remind", "t": ",".join(user_times(chat_id))})
    return ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="Напоминания", web_app=WebAppInfo(url=url))]],
        resize_keyboard=True,
        is_persistent=True,
    )


def remind_text(chat_id: int) -> str:
    times = user_times(chat_id)
    return f"Reminders: {', '.join(times)} ({tz_label(chat_id)})." if times else "Reminders are off."


def open_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="Открыть тренажёр", web_app=WebAppInfo(url=WEBAPP_URL))]]
    )


def seen_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="Got it", callback_data="seen")]])


def due_now(chat_id: int, now_utc: datetime) -> bool:
    """Наступило ли у пользователя одно из его времён (по его часовому поясу) и не слали ли уже в эту минуту."""
    local = now_utc.astimezone(user_tz(chat_id))
    hm = local.strftime("%H:%M")
    key = local.strftime("%Y-%m-%d ") + hm
    if hm in user_times(chat_id) and LAST_SENT.get(chat_id) != key:
        LAST_SENT[chat_id] = key
        return True
    return False


async def check_reminders(now_utc: datetime = None):
    now_utc = now_utc or datetime.now(timezone.utc)
    for chat_id in list(SUBS):
        if not due_now(chat_id, now_utc):
            continue
        if now_utc.timestamp() - ACTIVITY.get(chat_id, 0) <= ACTIVE_WINDOW:
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
        await check_reminders()
        await asyncio.sleep(20)


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
    await m.answer(remind_text(m.chat.id) + " Change them with the button below.", reply_markup=remind_kb(m.chat.id))


@dp.message(Command("word"))
async def word(m: Message):
    touch(m.chat.id)
    w = random.choice(WORDS)
    await m.answer(f"{w['en']}\n{w['ru']}\n\nТема: {w['topic']}", reply_markup=open_kb())


@dp.message(F.web_app_data)
async def web_app_data(m: Message):
    """Mini App прислал время напоминаний и часовой пояс телефона."""
    touch(m.chat.id)
    try:
        data = json.loads(m.web_app_data.data)
    except ValueError:
        return
    if not isinstance(data, dict) or data.get("type") != "remind":
        return
    times = sorted({t for t in data.get("times", []) if isinstance(t, str) and TIME_RE.match(t)})[:MAX_TIMES]
    off = data.get("off")
    s = {"times": times, "off": off if isinstance(off, int) and -720 <= off <= 840 else DEFAULT_OFFSET}
    tz = data.get("tz")
    if isinstance(tz, str) and tz:
        try:
            ZoneInfo(tz)
            s["tz"] = tz
        except Exception:
            pass
    SETTINGS[m.chat.id] = s
    save_json(SETTINGS_FILE, SETTINGS)
    SUBS.add(m.chat.id)
    save_json(SUBS_FILE, sorted(SUBS))
    await m.answer(remind_text(m.chat.id), reply_markup=remind_kb(m.chat.id))


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
