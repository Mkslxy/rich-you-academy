import json
import random
import time

with open("users.json", "r", encoding='UTF-8') as file:
    data = json.load(file)


def access_required(username, required_role):
    user = None

    for name in data:
        if name['name'] == username:
            user = name
            break

    if not user:
        raise PermissionError("User not found")

    if user['access_right'] != required_role:
        raise PermissionError(f"User {username} does not have the required role {required_role}")

    return user


def logging_before(func):
    def wrapper(*args, **kwargs):
        print(f"CALLING {func.__name__}: ARGS={args}, KWARGS={kwargs}")
        return func(*args, **kwargs)

    return wrapper


def logging_after(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        print(f"PROCESSED {func.__name__}: RESULT={result}")
        return result

    return wrapper


def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"TIMER LOGGED {func.__name__} took {end - start:.4f} seconds")
        return result

    return wrapper


def sort(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return sorted(result)

    return wrapper


def access_required_decorator(required_role):
    def decorator(func):
        def wrapper(*args, **kwargs):
            username = input("Username: ")
            access_required(username, required_role)
            return func(*args, **kwargs)

        return wrapper

    return decorator


@access_required_decorator("admin")
@logging_before
@logging_after
@timer
@sort
def get_alphabet():
    letters = list('abcdefghijklmnopqrstuvwxyz')
    random.shuffle(letters)
    return letters


alphabet = get_alphabet()
print("Final result: ", alphabet)
