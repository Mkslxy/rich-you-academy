import cmd
import os
import requests
import urllib.parse

from dotenv import load_dotenv

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")
TRANSLATE_KEY = os.getenv("TRANSLATE_API")
city = str


def get_weather_message(city):
    WEATHER_KEY = os.getenv("WEATHER_API")
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": WEATHER_KEY,
        "units": "metric",
        "lang": "uk",
    }

    r = requests.get(url, params=params)
    data = r.json()

    name = data["name"]
    country = data["sys"]["country"]
    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    description = data["weather"][0]["description"]

    message = (
        f"Name: {name}\n"
        f"Country: {country}\n"
        f"Temp: {temp}°C\n"
        f"Humidity: {humidity}%\n"
        f"Description: {description}\n"
    )

    return message


def get_currency_message(currency: str):
    CURRENCY_KEY = os.getenv("CURRENCY_API")
    code = (currency or "").strip().upper()
    url = "https://api.exchangerate.host/live"

    r = requests.get(url, timeout=10)
    if not r.ok:
        return "Error"

    data = r.json()

    rate = data.get["result"]

    return (f"Currency: {code}\n"
            f"To UAH: {rate}\n")

def get_translate_message(arg: str):
    parts = arg.split(" ", 1)
    if len(parts) < 2:
        return "You didn't write text or it below 2 letters."
    target_lang, text = parts[0], parts[1]
    url = f"https://lingva.ml/api/v1/auto/{target_lang}/{urllib.parse.quote(text)}"
    r = requests.get(url, timeout=10)
    if not r.ok:
        return "Problem with translating"
    data = r.json()
    translation = data.get("translation")
    if not translation:
        return "No translation"
    return f"Your language is {target_lang}:\n{translation}"


def send_to_telegram(message: str):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": message}
    requests.post(url, json=payload)


HELP_TEXT = (
    "Доступні команди:\n"
    "/weather {city}\n"
    "/currency {currency}\n"
    "/translate {lang} {text}\n"
    "/catfact\n"
    "/exit — вихід"
)

if __name__ == "__main__":
    print(HELP_TEXT)

    while True:
        cmd_input = input("\nВведіть команду: ").strip()
        if not cmd_input:
            continue

        if cmd_input.lower() == "/exit":
            print("Вихід...")
            break

        if cmd_input.startswith("/weather "):
            city = cmd_input[len("/weather "):].strip()
            message = get_weather_message(city)
            send_to_telegram(message)

        elif cmd_input.startswith("/currency "):
            currency = cmd_input[len("/currency "):].strip()
            message = get_currency_message(currency)
            send_to_telegram(message)

        elif cmd_input.startswith("/translate "):
            text = cmd_input[len("/translate "):].strip()
            message = get_translate_message(text)
            send_to_telegram(message)

        else:
            print("Команда не розпізнана. Спробуйте ще раз.")
