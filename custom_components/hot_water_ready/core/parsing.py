"""Reading saved core state back: each helper accepts one shape and raises on anything else.

TypeError or ValueError, which every `from_dict` turns into its own "Unreadable ..." error.
"""

from datetime import datetime


def aware_datetime(raw: object) -> datetime:
    """An ISO datetime with its UTC offset; a naive one would be read in the wrong zone."""
    if not isinstance(raw, str):
        raise TypeError("datetime")
    moment = datetime.fromisoformat(raw)
    if moment.tzinfo is None:
        raise ValueError("naive datetime")
    return moment


def optional_aware_datetime(raw: object) -> datetime | None:
    """`aware_datetime`, or None."""
    return None if raw is None else aware_datetime(raw)


def number(raw: object) -> float:
    """An int or a float; not a bool, which Python counts as an int."""
    if isinstance(raw, bool) or not isinstance(raw, int | float):
        raise TypeError("number")
    return float(raw)


def optional_number(raw: object) -> float | None:
    """`number`, or None."""
    return None if raw is None else number(raw)


def flag(raw: object) -> bool:
    """True or false, nothing else."""
    if not isinstance(raw, bool):
        raise TypeError("bool")
    return raw


def name_list(raw: object) -> frozenset[str]:
    """A list of strings, as a set."""
    if not isinstance(raw, list) or not all(isinstance(item, str) for item in raw):
        raise TypeError("list of names")
    return frozenset(raw)
