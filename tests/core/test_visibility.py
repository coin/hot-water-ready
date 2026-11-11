"""Who sees whose ready times: public and private members (decision 15)."""

from datetime import UTC, datetime

from custom_components.hot_water_ready.core.controller import Occurrence
from custom_components.hot_water_ready.core.visibility import hidden_members, visible_occurrences

SEVEN = datetime(2026, 11, 2, 7, 0, tzinfo=UTC)
EIGHT = datetime(2026, 11, 2, 8, 0, tzinfo=UTC)


def test_others_do_not_see_a_private_member() -> None:
    assert hidden_members({"tiago"}, viewer_member="maria", is_admin=False) == {"tiago"}


def test_a_private_member_sees_their_own() -> None:
    assert hidden_members({"tiago"}, viewer_member="tiago", is_admin=False) == frozenset()


def test_admins_see_everyone() -> None:
    assert hidden_members({"tiago", "maria"}, viewer_member=None, is_admin=True) == frozenset()


def test_someone_with_no_member_sees_no_private_member() -> None:
    assert hidden_members({"tiago"}, viewer_member=None, is_admin=False) == {"tiago"}


def test_a_shared_time_keeps_only_the_visible_members() -> None:
    found = visible_occurrences(
        [Occurrence(SEVEN, frozenset({"tiago", "maria"}))], frozenset({"tiago"})
    )
    assert found == [Occurrence(SEVEN, frozenset({"maria"}))]


def test_a_time_only_a_hidden_member_wants_is_dropped() -> None:
    found = visible_occurrences(
        [Occurrence(SEVEN, frozenset({"tiago"})), Occurrence(EIGHT, frozenset({"maria"}))],
        frozenset({"tiago"}),
    )
    assert found == [Occurrence(EIGHT, frozenset({"maria"}))]


def test_nothing_hidden_keeps_everything() -> None:
    every = [Occurrence(SEVEN, frozenset({"tiago"}))]
    assert visible_occurrences(every, frozenset()) == every
