"""Who sees a member's ready times and heat-now requests (decision 15).

A member is public or private. A private member's ready times and requests are left out of what
other members see; the member themselves and administrators see everything. The heater still
heats for them as for anyone: visibility changes what is shown, never what is done.
"""

from collections.abc import Iterable
from enum import StrEnum

from .controller import Occurrence


class Visibility(StrEnum):
    """A member's visibility. Stored as a value with options, so a level can be added later."""

    PUBLIC = "public"
    PRIVATE = "private"


def hidden_members(
    private: Iterable[str], *, viewer_member: str | None, is_admin: bool
) -> frozenset[str]:
    """The members whose ready times and requests this viewer does not see.

    Administrators see everyone; anyone else sees every private member but their own.
    """
    if is_admin:
        return frozenset()
    return frozenset(private) - {viewer_member}


def visible_occurrences(
    occurrences: Iterable[Occurrence], hidden: frozenset[str]
) -> list[Occurrence]:
    """The occurrences with the hidden members taken out; one left with nobody is dropped."""
    if not hidden:
        return list(occurrences)
    kept = (Occurrence(o.at, o.members - hidden) for o in occurrences)
    return [o for o in kept if o.members]
