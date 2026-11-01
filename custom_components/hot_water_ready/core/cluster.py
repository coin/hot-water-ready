"""Heating higher when the store cannot carry a cluster of showers (spec 4.5, issue 03).

Only with the tank volume and the element power known. For n showers spanning S, the store must
hold E = n x E_shower - P x S (what the element adds during the cluster is taken off), which
needs T = T_cold + E / (f x V x 0.001163). When T is above the normal target, the cluster's
target is raised to it, capped at the maximum temperature; above the cap, the household is warned.

The constants are the back-to-back research's (2026-10-31): 50 L mixed at 39 C a shower, a
usable fraction of 0.75, and the mains temperature by season.
"""

from dataclasses import dataclass
import math

KWH_PER_LITRE_DEGREE = 0.001163
USABLE_FRACTION = 0.75
MAX_TEMPERATURE = 50.0  # the scald limit without a mixing valve (spec 3.1)

# Month (1 to 12) to (energy per shower in kWh, cold water in C).
WINTER, SHOULDER, SUMMER = (1.7, 10.0), (1.4, 15.0), (1.0, 20.0)
SEASONS = {
    **dict.fromkeys((11, 12, 1, 2, 3), WINTER),
    **dict.fromkeys((4, 5, 10), SHOULDER),
    **dict.fromkeys((6, 7, 8, 9), SUMMER),
}


@dataclass(frozen=True)
class Tank:
    """What the household entered about the cylinder; both are needed for the check."""

    litres: float
    element_watts: float
    max_temperature: float = MAX_TEMPERATURE


@dataclass(frozen=True)
class ClusterTarget:
    """The target for a cluster: raised when needed, capped, and whether even the cap is short."""

    target: float
    needed: float  # what the store would have to be at; may be below the normal target
    short: bool  # the cap is below what is needed: the last showers may run cool


def needed_temperature(tank: Tank, *, showers: int, span_minutes: float, month: int) -> float:
    """The store temperature that carries `showers` over `span_minutes` (spec 4.5)."""
    shower_kwh, cold = SEASONS[month]
    energy = showers * shower_kwh - tank.element_watts / 1000 * span_minutes / 60
    return cold + max(0.0, energy) / (USABLE_FRACTION * tank.litres * KWH_PER_LITRE_DEGREE)


def cluster_target(
    tank: Tank | None, target: float, *, showers: int, span_minutes: float, month: int
) -> ClusterTarget:
    """The normal target, raised for a cluster the store cannot carry, up to the cap.

    A raise is rounded up to a whole degree, as in the research's rule.
    """
    if tank is None:
        return ClusterTarget(target=target, needed=target, short=False)
    needed = needed_temperature(tank, showers=showers, span_minutes=span_minutes, month=month)
    raised = target if needed <= target else min(math.ceil(needed), tank.max_temperature)
    raised = max(raised, target)
    return ClusterTarget(target=raised, needed=needed, short=needed > raised)
