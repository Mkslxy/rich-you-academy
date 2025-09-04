import os
import requests

from dotenv import load_dotenv

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")
TRANSLATE_KEY = os.getenv("TRANSLATE_API")


def get_weather_message(city: str):
    WEATHER_KEY = os.getenv("WEATHER_API")
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": WEATHER_KEY,
        "units": "metric",
        "lang": "uk",
    }

    r = requests.get(url, params=params, timeout=5)

    if not r.ok:
        return "NOT VALID CITY , PLEASE TRY AGAIN"

    data = r.json()

    name = data["name"]
    country = data["sys"]["country"]
    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    description = data["weather"][0]["description"]

    return (f"Name: {name}\n"
            f"Country: {country}\n"
            f"Temp: {temp}°C\n"
            f"Humidity: {humidity}%\n"
            f"Description: {description}\n"
            )


def get_currency_message(currency: str, target: str = "UAH"):
    CURRENCY_KEY = os.getenv("CURRENCY_API")
    url = "https://api.exchangerate.host/convert"
    params = {
        "from": currency.upper(),
        "to": target.upper(),
        "amount": 1,
        "access_key": CURRENCY_KEY,
    }

    r = requests.get(url, params=params)

    data = r.json()

    rate = data.get("result")

    if rate is None:
        return "UNKNOWN VALUE"

    return (f"Currency: {currency}\n "
            f"UAH: {rate}")


def get_translate_message(arg: str):
    TRANSLATE_KEY = os.getenv("TRANSLATE_API")

    if TRANSLATE_KEY is None:
        return "API NOT FOUND"

    parts = arg.split(" ", 1)
    if len(parts) < 2:
        return "You didn't write text or it below 2 letters."

    target_lang = parts[0].upper()
    text = parts[1]
    url = "https://api-free.deepl.com/v2/translate"
    params = {
        "auth_key": TRANSLATE_KEY,
        "target_lang": target_lang,
        "text": text,
    }

    r = requests.get(url, params=params, timeout=10)

    if not r.ok:
        return "Problem with translation"

    data = r.json()

    translation = data.get("translations")
    if not translation:
        return "No translation found"

    translation = translation[0].get("text")
    return f"Your language: {target_lang}\nTranslation: {translation}"


def get_cat_img():
    url = "https://api.thecatapi.com/v1/images/search"
    r = requests.get(url, timeout=10)
    if not r.ok:
        return "Something went wrong"

    data = r.json()
    return data[0]["url"]


def send_to_telegram(message: str):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": message}
    requests.post(url, params=payload)


HELP_TEXT = (
    "Available commands:\n"
    "/weather {city}\n"
    "/currency {currency}\n"
    "/translate {lang text}\n"
    "/cat {anything}\n"
    "/exit"
)

if __name__ == "__main__":
    print(HELP_TEXT)

    while True:
        cmd_input = input("\nEnter command: ").strip()
        if not cmd_input:
            continue

        if cmd_input.lower() == "/exit":
            print("Exit...")
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

        elif cmd_input.startswith("/cat "):
            cat_url = get_cat_img()
            if cat_url.startswith("https"):
                telegram_url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendPhoto"
                payload = {"chat_id": CHAT_ID, "photo": cat_url}
                requests.post(telegram_url, params=payload)
            else:
                send_to_telegram(cat_url)

        else:
            print("Not a valid command.")
