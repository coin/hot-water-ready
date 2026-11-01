"""Run the owner's PT-PT lint over every Portuguese on-screen string in the repository.

The lint lives outside the repository (~/.claude/skills/review-mr/scripts/lint-pt.py), so CI
cannot run it; run this before committing a change to Portuguese text:

    python scripts/lint-pt-strings.py

It catches recorded Brazilian forms and calques, not everything: read the text as well.
"""

import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile

ROOT = Path(__file__).parents[1]
LINT = Path.home() / ".claude" / "skills" / "review-mr" / "scripts" / "lint-pt.py"


def _strings(value: object) -> list[str]:
    if isinstance(value, dict):
        return [text for item in value.values() for text in _strings(item)]
    return [value] if isinstance(value, str) else []


def main() -> int:
    """Collect the strings, run the lint, return its exit code."""
    if not LINT.exists():
        print(f"{LINT} not found; nothing checked.")
        return 0
    texts = _strings(
        json.loads(
            (ROOT / "custom_components/hot_water_ready/translations/pt.json").read_text("utf-8")
        )
    )
    card = (ROOT / "card/src/i18n.ts").read_text("utf-8")
    texts += re.findall(r'":\s*"([^"]*)"', card[card.index("const pt") :])
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as out:
        out.write("\n\n".join(texts))
    return subprocess.run([sys.executable, str(LINT), out.name], check=False).returncode


if __name__ == "__main__":
    sys.exit(main())
