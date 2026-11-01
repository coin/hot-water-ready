"""The solar comparison (spec 7, issue 12): a record per window, and the 30-day verdict.

A record starts when version 1's lead says to start, which is never later than the solar-aware
rule's start, and ends when the water first reaches the target, or when the window closes
without. It notes the rule applied and how much the heater ran.

The verdict sets what the rule applied did against what the other rule would have done. The sun
during the window is taken from what happened: what the water gained beyond the heater's share,
(end - start - heater minutes / rate) per minute. With that sun, version 1 heats from its own
start; the solar-aware rule is replayed a minute at a time, deciding as the real one does, and
then heats at heater plus sun. A window counts on time when the solar-aware rule reached the
target by the ready time. Windows with a fault or with water drawn are left out: in both, the
gain says nothing about the sun.
"""

from collections.abc import Iterable
from dataclasses import dataclass, field, replace
from datetime import UTC, datetime, timedelta
from typing import Any, Literal

from .controller import Occurrence, Settings, lead_minutes, solar_lead_minutes
from .parsing import aware_datetime, flag, number, optional_aware_datetime, optional_number

Rule = Literal["version_1", "solar"]
RULES: tuple[Rule, ...] = ("version_1", "solar")
KEEP = timedelta(days=365)
VERDICT_SPAN = timedelta(days=30)
MAX_DIP = 1.0  # a fall bigger than this while heating is water drawn, as for the rate (spec 4.2)
_EPSILON = 1e-6
_MINUTE = timedelta(minutes=1)


@dataclass(frozen=True)
class WindowRecord:
    """One window, as it happened."""

    ready_at: datetime  # the window's first ready time
    members: tuple[str, ...]
    rule: Rule  # the rule applied
    target: float
    rate: float  # the heater's minutes per degree at the start
    lead_margin: float  # the settings the rules decided with, for the replay
    lead_cap: float
    start: datetime  # when the record started: version 1's start
    start_temperature: float
    rise: float | None  # the solar rise measured at the start, degrees per minute
    solar_start: datetime | None  # when the solar rule started heating, if it was applied
    heater_minutes: float  # the element on, from the start until the target was reached
    energy_kwh: float | None  # measured over the same minutes, with a power sensor
    reached_at: datetime | None
    end: datetime
    end_temperature: float
    fault: bool = False
    drawn: bool = False

    def to_dict(self) -> dict[str, Any]:
        """Plain data for storage and diagnostics."""
        return {
            "ready_at": self.ready_at.isoformat(),
            "members": list(self.members),
            "rule": self.rule,
            "target": self.target,
            "rate": self.rate,
            "lead_margin": self.lead_margin,
            "lead_cap": self.lead_cap,
            "start": self.start.isoformat(),
            "start_temperature": self.start_temperature,
            "rise": self.rise,
            "solar_start": _iso(self.solar_start),
            "heater_minutes": self.heater_minutes,
            "energy_kwh": self.energy_kwh,
            "reached_at": _iso(self.reached_at),
            "end": self.end.isoformat(),
            "end_temperature": self.end_temperature,
            "fault": self.fault,
            "drawn": self.drawn,
        }

    @classmethod
    def from_dict(cls, data: object) -> WindowRecord:
        """Rebuild from `to_dict`'s output; TypeError, KeyError or ValueError when it is not."""
        if not isinstance(data, dict):
            raise TypeError("record")
        rule = data["rule"]
        if rule not in RULES:
            raise ValueError(f"rule {rule!r}")
        members = data["members"]
        if not isinstance(members, list) or not all(isinstance(m, str) for m in members):
            raise TypeError("members")
        return cls(
            ready_at=aware_datetime(data["ready_at"]),
            members=tuple(members),
            rule=rule,
            target=number(data["target"]),
            rate=number(data["rate"]),
            lead_margin=number(data["lead_margin"]),
            lead_cap=number(data["lead_cap"]),
            start=aware_datetime(data["start"]),
            start_temperature=number(data["start_temperature"]),
            rise=optional_number(data["rise"]),
            solar_start=optional_aware_datetime(data["solar_start"]),
            heater_minutes=number(data["heater_minutes"]),
            energy_kwh=optional_number(data["energy_kwh"]),
            reached_at=optional_aware_datetime(data["reached_at"]),
            end=aware_datetime(data["end"]),
            end_temperature=number(data["end_temperature"]),
            fault=flag(data["fault"]),
            drawn=flag(data["drawn"]),
        )


def _iso(moment: datetime | None) -> str | None:
    return None if moment is None else moment.isoformat()


@dataclass
class _Recording:
    """The record being written, and what the next step needs to add to it."""

    record: WindowRecord
    last: datetime
    element_on: bool
    power_w: float | None
    highest: float  # the warmest reading so far, to notice water drawn


@dataclass
class ComparisonState:
    """The records of the last year. The one being written is not saved: a restart drops it."""

    records: list[WindowRecord] = field(default_factory=list)
    current: _Recording | None = field(default=None, compare=False)

    def to_dict(self) -> dict[str, Any]:
        """Plain data for storage."""
        return {"records": [record.to_dict() for record in self.records]}

    @classmethod
    def from_dict(cls, data: object) -> ComparisonState:
        """Rebuild from `to_dict`'s output; ValueError when it is not that."""
        try:
            if not isinstance(data, dict) or not isinstance(data.get("records", []), list):
                raise TypeError("records")
            return cls(records=[WindowRecord.from_dict(item) for item in data.get("records", [])])
        except (KeyError, TypeError, ValueError) as err:
            msg = f"Unreadable comparison state: {err!r}"
            raise ValueError(msg) from err


class Recorder:
    """Writes a record per window, stepped with the controller."""

    def __init__(self, state: ComparisonState | None = None) -> None:
        """Start from saved records, or none."""
        self.state = state or ComparisonState()
        # Taken as open after a restart, so no record begins halfway through a window.
        self._window_was_open = True

    def abandon(self) -> None:
        """Drop the record being written: the heater is run by hand for now."""
        self.state.current = None

    def step(
        self,
        *,
        now: datetime,
        settings: Settings,
        temperature: float | None,
        rise: float | None,
        next_ready: Occurrence | None,
        window_open: bool,
        element_on: bool | None,
        power_w: float | None,
        fault: bool,
    ) -> None:
        """One look, after the controller has stepped."""
        now = now.astimezone(UTC)
        self.state.records = [r for r in self.state.records if r.ready_at > now - KEEP]
        just_opened = window_open and not self._window_was_open
        self._window_was_open = window_open
        current = self.state.current
        if current is not None:
            current.record = _stepped(
                current, now=now, temperature=temperature, element_on=bool(element_on), fault=fault
            )
            if now >= current.record.ready_at and (
                current.record.reached_at is not None or not window_open
            ):
                self.state.records.append(current.record)
                self.state.current = None
                return
        elif (
            next_ready is not None and temperature is not None and (just_opened or not window_open)
        ):
            current = self._started(
                now=now,
                settings=settings,
                temperature=temperature,
                rise=rise,
                next_ready=next_ready,
                window_open=window_open,
            )
        if current is not None:
            current.last, current.element_on, current.power_w = now, bool(element_on), power_w

    def _started(
        self,
        *,
        now: datetime,
        settings: Settings,
        temperature: float,
        rise: float | None,
        next_ready: Occurrence,
        window_open: bool,
    ) -> _Recording | None:
        """The record of the coming window, once version 1's lead says to start."""
        ready_at = next_ready.at.astimezone(UTC)
        if any(r.ready_at == ready_at for r in self.state.records[-3:]):
            return None
        until = (ready_at - now).total_seconds() / 60
        if until > lead_minutes(settings, temperature) and not window_open:
            return None
        rule: Rule = "solar" if settings.solar_aware else "version_1"
        record = WindowRecord(
            ready_at=ready_at,
            members=tuple(sorted(next_ready.members)),
            rule=rule,
            target=settings.target,
            rate=settings.rate_minutes_per_degree,
            lead_margin=settings.lead_margin_minutes,
            lead_cap=settings.lead_cap_minutes,
            start=now,
            start_temperature=temperature,
            rise=rise,
            solar_start=now if rule == "solar" and window_open else None,
            heater_minutes=0.0,
            energy_kwh=None,
            reached_at=None,
            end=now,
            end_temperature=temperature,
        )
        self.state.current = _Recording(
            record=_reached(record, now, temperature),
            last=now,
            element_on=False,
            power_w=None,
            highest=temperature,
        )
        return self.state.current


def _stepped(
    current: _Recording,
    *,
    now: datetime,
    temperature: float | None,
    element_on: bool,
    fault: bool,
) -> WindowRecord:
    """The record with this step's heating, energy and reading added."""
    record = current.record
    changes: dict[str, Any] = {"fault": record.fault or fault}
    if record.reached_at is None:
        minutes = (now - current.last).total_seconds() / 60
        if current.element_on:
            changes["heater_minutes"] = record.heater_minutes + minutes
            if current.power_w is not None:
                energy = (record.energy_kwh or 0.0) + current.power_w * minutes / 60_000
                changes["energy_kwh"] = energy
        if temperature is not None:
            changes["end"], changes["end_temperature"] = now, temperature
            current.highest = max(current.highest, temperature)
            changes["drawn"] = record.drawn or temperature < current.highest - MAX_DIP
    if record.rule == "solar" and record.solar_start is None and element_on:
        changes["solar_start"] = now
    record = replace(record, **changes)
    return record if temperature is None else _reached(record, now, temperature)


def _reached(record: WindowRecord, now: datetime, temperature: float) -> WindowRecord:
    """The record with the moment the water first reached the target, if it just did."""
    if record.reached_at is None and temperature >= record.target - _EPSILON:
        return replace(record, reached_at=now, end=now, end_temperature=temperature)
    return record


# ---------------------------------------------------------------- the verdict


@dataclass(frozen=True)
class Outcome:
    """How a rule did, or would have done, for one window."""

    on_time: bool
    heater_minutes: float


def sun_per_minute(record: WindowRecord) -> float:
    """The sun's help during the window, degrees per minute, from what happened."""
    minutes = (record.end - record.start).total_seconds() / 60
    if minutes <= 0:
        return 0.0
    gained = record.end_temperature - record.start_temperature
    return (gained - record.heater_minutes / record.rate) / minutes


def replay(record: WindowRecord, rule: Rule) -> Outcome:
    """What `rule` did in this window, or would have done."""
    if rule == record.rule:
        on_time = record.reached_at is not None and record.reached_at <= record.ready_at
        return Outcome(on_time=on_time, heater_minutes=record.heater_minutes)
    sun = sun_per_minute(record)
    if rule == "version_1":
        return _heat(record, record.start, record.start_temperature, sun)
    return _replay_solar(record, sun)


def _replay_solar(record: WindowRecord, sun: float) -> Outcome:
    """The solar-aware rule a minute at a time, with the sun as it was, until it starts."""
    settings = Settings(
        target=record.target,
        rate_minutes_per_degree=record.rate,
        lead_margin_minutes=record.lead_margin,
        lead_cap_minutes=record.lead_cap,
    )
    moment, water = record.start, record.start_temperature
    while moment < record.ready_at and water < record.target - _EPSILON:
        until = (record.ready_at - moment).total_seconds() / 60
        if solar_lead_minutes(settings, water, sun, until) >= until:
            break
        moment += _MINUTE
        water += sun
    # The window opens at the ready time at the latest, as in the controller.
    return _heat(record, moment, water, sun)


def _heat(record: WindowRecord, start: datetime, water: float, sun: float) -> Outcome:
    """Heat from `start` at heater plus sun until the target."""
    to_go = record.target - water
    if to_go <= _EPSILON:
        return Outcome(on_time=start <= record.ready_at, heater_minutes=0.0)
    speed = 1 / record.rate + sun
    if speed <= 0:
        return Outcome(on_time=False, heater_minutes=0.0)
    minutes = to_go / speed
    reached = start + timedelta(minutes=minutes)
    return Outcome(on_time=reached <= record.ready_at, heater_minutes=minutes)


@dataclass(frozen=True)
class Verdict:
    """The last 30 days in one sentence's worth of numbers (spec 7)."""

    windows: int
    on_time: int  # windows the solar-aware rule had, or would have had, ready on time
    minutes_saved: float  # heater minutes the solar-aware rule saved, or would have
    kwh: float | None  # None unless every window has a measure of energy
    solar_windows: int  # windows the solar-aware rule was applied to...
    solar_on_time: int  # ...and how many of them it had ready on time


def verdict(
    records: Iterable[WindowRecord], *, now: datetime, element_power_w: float | None
) -> Verdict:
    """The comparison over the last 30 days, leaving out windows with a fault or a draw."""
    since = now.astimezone(UTC) - VERDICT_SPAN
    counted = [r for r in records if r.ready_at > since and not r.fault and not r.drawn]
    on_time = solar_on_time = 0
    minutes_saved = 0.0
    # kWh only when every window has a measure of energy: a partial sum would read as a total.
    kwh: float | None = 0.0 if counted else None
    for record in counted:
        version_1, solar = replay(record, "version_1"), replay(record, "solar")
        on_time += solar.on_time
        solar_on_time += solar.on_time and record.rule == "solar"
        saved = version_1.heater_minutes - solar.heater_minutes
        minutes_saved += saved
        per_minute = _kwh_per_minute(record, element_power_w)
        kwh = None if kwh is None or per_minute is None else kwh + saved * per_minute
    return Verdict(
        windows=len(counted),
        on_time=on_time,
        minutes_saved=minutes_saved,
        kwh=kwh,
        solar_windows=sum(r.rule == "solar" for r in counted),
        solar_on_time=solar_on_time,
    )


def _kwh_per_minute(record: WindowRecord, element_power_w: float | None) -> float | None:
    if record.energy_kwh is not None and record.heater_minutes > 0:
        return record.energy_kwh / record.heater_minutes
    if element_power_w is not None:
        return element_power_w / 60_000
    return None
