# pylint: disable=missing-docstring

from colorama import Fore, Style


def blue(text: str) -> str:
    return Fore.BLUE + text + Style.RESET_ALL


def cyan(text: str) -> str:
    return Fore.CYAN + text + Style.RESET_ALL


def green(text: str) -> str:
    return Fore.GREEN + text + Style.RESET_ALL


def red(text: str) -> str:
    return Fore.RED + text + Style.RESET_ALL


def yellow(text: str) -> str:
    return Fore.YELLOW + text + Style.RESET_ALL


def magenta(text: str) -> str:
    return Fore.MAGENTA + text + Style.RESET_ALL
