"""Checks on the repository itself that no linter makes."""

import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).parents[1]
MANIFEST = ROOT / "custom_components" / "hot_water_ready" / "manifest.json"
EM_DASH = "\u2014"


def test_manifest_has_the_fields_hacs_and_the_marketplace_read() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for key in ("version", "documentation", "issue_tracker", "codeowners", "categories"):
        assert key in manifest, key
    assert 1 <= len(manifest["categories"]) <= 3


def _tracked_text_files() -> list[Path]:
    names = subprocess.run(
        ["git", "ls-files", "-z"], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout.split("\0")
    skip = {".png", ".lock"}
    return [
        ROOT / name
        for name in names
        if name
        and Path(name).suffix not in skip
        and not name.endswith(("package-lock.json", "hot-water-ready-card.js"))
    ]


def test_no_em_dashes() -> None:
    offenders = [
        f"{path.relative_to(ROOT)}:{number}"
        for path in _tracked_text_files()
        if path.exists()
        for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1)
        if EM_DASH in line
    ]
    assert not offenders, "Use a comma, colon, parentheses or a full stop instead: " + ", ".join(
        offenders
    )


def test_the_readme_names_every_option() -> None:
    """A new option is documented: each option's English label appears in the README."""
    english = json.loads(
        (ROOT / "custom_components" / "hot_water_ready" / "translations" / "en.json").read_text(
            encoding="utf-8"
        )
    )
    readme = (ROOT / "README.md").read_text(encoding="utf-8").lower()
    labels = english["options"]["step"]["init"]["data"].values()
    missing = [label for label in labels if label.removesuffix(" (optional)").lower() not in readme]
    assert missing == []
