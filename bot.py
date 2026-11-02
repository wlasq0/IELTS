import asyncio
import json
import os
import random
from pathlib import Path

from aiogram import Bot, Dispatcher
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


def open_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="Открыть тренажёр", web_app=WebAppInfo(url=WEBAPP_URL))]]
    )


@dp.message(CommandStart())
async def start(m: Message):
    await bot.set_chat_menu_button(
        chat_id=m.chat.id,
        menu_button=MenuButtonWebApp(text="Учить", web_app=WebAppInfo(url=WEBAPP_URL)),
    )
    await m.answer(
        "Hi! This is a bot for IELTS preparation. Tap the button below to start.",
        reply_markup=open_kb(),
    )


@dp.message(Command("word"))
async def word(m: Message):
    w = random.choice(WORDS)
    await m.answer(f"{w['en']}\n— {w['ru']}\n\nТема: {w['topic']}", reply_markup=open_kb())


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
