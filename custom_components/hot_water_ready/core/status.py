"""The heater's status as the household sees it."""

from enum import StrEnum


class Status(StrEnum):
    """What the status sensor and the card show."""

    WAITING = "waiting"
    HEATING = "heating"
    READY = "ready"
    FAULT = "fault"
    MANUAL = "manual"


def heater_status(*, temperature: float | None, target: float, heating: bool = False) -> Status:
    """Heating while the element is wanted on; else ready at or above the target (spec 4.4)."""
    if heating:
        return Status.HEATING
    if temperature is not None and temperature >= target:
        return Status.READY
    return Status.WAITING
