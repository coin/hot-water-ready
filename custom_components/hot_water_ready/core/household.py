"""The household's ready times as one list, with away taken into account (spec 3.3, 4.1)."""

from collections.abc import Iterable
from dataclasses import dataclass, field
from datetime import date, datetime

from .controller import Occurrence
from .ready_times import ReadyTime, occurrences


@dataclass(frozen=True)
class Away:
    """A member's pause. With `until`, it lasts to the end of that day and then ends by itself."""

    on: bool = False
    until: date | None = None

    def active_on(self, day: date) -> bool:
        """Whether ready times on `day` are paused."""
        return self.on and (self.until is None or day <= self.until)

    def expired(self, today: date) -> bool:
        """Whether an away with an end date is over and should switch itself off."""
        return self.on and self.until is not None and today > self.until


@dataclass(frozen=True)
class MemberPlan:
    """One member's ready times and away."""

    member_id: str
    ready_times: tuple[ReadyTime, ...]
    away: Away = field(default_factory=Away)


def household_occurrences(
    plans: Iterable[MemberPlan], *, start: datetime, end: datetime
) -> list[Occurrence]:
    """Every member's ready times in [start, end), people wanting the same moment together."""
    by_time: dict[datetime, set[str]] = {}
    for plan in plans:
        for when, _ready in occurrences(plan.ready_times, start=start, end=end):
            if not plan.away.active_on(when.date()):
                by_time.setdefault(when, set()).add(plan.member_id)
    return [Occurrence(at, frozenset(ids)) for at, ids in sorted(by_time.items())]
