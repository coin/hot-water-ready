"""Every text the integration shows or sends exists in every language, English first (ticket 11).

The card's texts are checked by TypeScript (its `pt` table is a `Record` over the English keys);
these tests cover the integration's `translations/*.json`.
"""

import json
from pathlib import Path
import re
from typing import Any

import pytest
import yaml

from custom_components.hot_water_ready.core.faults import Fault

PACKAGE = Path(__file__).parents[1] / "custom_components" / "hot_water_ready"
EN = json.loads((PACKAGE / "translations" / "en.json").read_text(encoding="utf-8"))
PLACEHOLDER = re.compile(r"\{(\w+)\}")


def _texts(tree: dict[str, Any], path: str = "") -> dict[str, str]:
    found: dict[str, str] = {}
    for key, value in tree.items():
        where = f"{path}.{key}" if path else key
        if isinstance(value, dict):
            found |= _texts(value, where)
        else:
            found[where] = value
    return found


LANGUAGES = sorted(path.stem for path in (PACKAGE / "translations").glob("*.json"))


EXPECTED = ["en", "pt", "pt-BR", "de", "fr", "es", "it", "nl", "pl", "sv", "da", "nb", "cs"]
EXPECTED += ["ru", "uk", "ja", "zh-Hans"]


def test_the_languages_are_all_there() -> None:
    assert sorted(EXPECTED) == LANGUAGES


def _language(code: str) -> dict[str, Any]:
    texts: dict[str, Any] = json.loads(
        (PACKAGE / "translations" / f"{code}.json").read_text(encoding="utf-8")
    )
    return texts


@pytest.mark.parametrize("code", LANGUAGES)
def test_each_language_has_the_english_texts(code: str) -> None:
    assert sorted(_texts(_language(code))) == sorted(_texts(EN))


@pytest.mark.parametrize("code", LANGUAGES)
def test_each_text_keeps_its_placeholders(code: str) -> None:
    texts = _texts(_language(code))
    differ = [
        path
        for path, text in _texts(EN).items()
        if set(PLACEHOLDER.findall(text)) != set(PLACEHOLDER.findall(texts.get(path, "")))
    ]
    assert differ == []


SOURCE = "\n".join(path.read_text(encoding="utf-8") for path in PACKAGE.rglob("*.py"))

# Where message keys appear in the code; each pattern must keep finding some, or it has gone stale.
KEY_PATTERNS = {
    "async_message": r'async_message\(\s*[\w.]+,\s*"(\w+)"',
    "action errors": r'_error\(\s*"(\w+)"',
    "websocket errors": r'_async_error\(\s*hass,\s*connection,\s*msg,\s*[\w.]+,\s*"(\w+)"',
    "Heater._message_for": r'return "(\w+)", \{',
    "reasons for async_nobody_to_tell": r'reason = "(\w+)"',
}


def test_every_key_pattern_still_finds_keys() -> None:
    assert [name for name, pattern in KEY_PATTERNS.items() if not re.search(pattern, SOURCE)] == []


def test_websocket_errors_are_never_written_out_in_english() -> None:
    websocket = (PACKAGE / "websocket.py").read_text(encoding="utf-8")
    assert re.findall(r'send_error\([^)]*"[A-Z][a-z]+ [a-z]', websocket) == []


def _message_keys_in_the_code() -> set[str]:
    """Every message key the code asks for, the per-fault families included."""
    keys = {key for pattern in KEY_PATTERNS.values() for key in re.findall(pattern, SOURCE)}
    keys |= {f"fault_{fault.value}" for fault in Fault}
    keys |= {f"fault_label_{fault.value}" for fault in Fault}
    return keys


def test_every_message_the_code_sends_is_translated() -> None:
    missing = sorted(key for key in _message_keys_in_the_code() if key not in EN["exceptions"])
    assert missing == []


def test_every_repairs_issue_is_translated() -> None:
    assert {fault.value for fault in Fault} <= set(EN["issues"])


def test_every_action_and_field_is_described() -> None:
    actions = yaml.safe_load((PACKAGE / "services.yaml").read_text(encoding="utf-8"))
    assert set(actions) == set(EN["services"])
    for action, spec in actions.items():
        described = EN["services"][action]
        assert described["name"], action
        assert described["description"], action
        assert set(spec.get("fields", {})) == set(described["fields"]), action
        assert all(field["name"] for field in described["fields"].values()), action
