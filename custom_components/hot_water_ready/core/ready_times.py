"""Ready times: a time of day on chosen weekdays (spec 3.3)."""

from collections.abc import Iterable
from dataclasses import dataclass
from datetime import UTC, date, datetime, time, timedelta, tzinfo


@dataclass(frozen=True)
class ReadyTime:
    """When a member wants hot water. Weekdays count from Monday, 0, to Sunday, 6."""

    id: str
    time: time
    weekdays: frozenset[int]
    enabled: bool = True


def local_datetime(day: date, at: time, zone: tzinfo) -> datetime:
    """`at` on `day` as a real moment, keeping the wall-clock time across daylight saving.

    A time skipped by the clocks going forward lands just after the gap (a 01:30 ready time on
    the night 01:00 becomes 02:00 is 02:30); in the hour repeated when they go back, the first
    of the two is taken.
    """
    naive = datetime.combine(day, at)
    moment = naive.replace(tzinfo=zone, fold=0)
    # Round-trip through UTC to normalise a time inside the spring-forward gap.
    return moment.astimezone(UTC).astimezone(zone)


def occurrences(
    ready_times: Iterable[ReadyTime], *, start: datetime, end: datetime
) -> list[tuple[datetime, ReadyTime]]:
    """Every enabled ready time happening in [start, end), soonest first.

    Times are in the time zone of `start`.
    """
    zone = start.tzinfo
    if zone is None:
        msg = "start must be timezone-aware"
        raise ValueError(msg)
    found: list[tuple[datetime, ReadyTime]] = []
    enabled = [ready for ready in ready_times if ready.enabled]
    day = start.date() - timedelta(days=1)
    while day <= end.date():
        for ready in enabled:
            if day.weekday() in ready.weekdays:
                when = local_datetime(day, ready.time, zone)
                if start <= when < end:
                    found.append((when, ready))
        day += timedelta(days=1)
    found.sort(key=lambda pair: (pair[0], pair[1].id))
    return found
