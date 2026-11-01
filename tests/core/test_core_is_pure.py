"""The scheduling core must run without Home Assistant (spec section 9)."""

import ast
from pathlib import Path

CORE = Path(__file__).parents[2] / "custom_components" / "hot_water_ready" / "core"


def _imported_modules(path: Path) -> set[str]:
    """Absolute module names, and relative imports that climb out of the core package."""
    tree = ast.parse(path.read_text(encoding="utf-8"))
    depth = len(path.relative_to(CORE).parts)  # 1 for core/x.py, 2 for core/sub/x.py
    names: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            names.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            if node.level == 0 and node.module:
                names.add(node.module)
            elif node.level > depth:
                names.add(f"{'.' * node.level}{node.module or ''} (outside the core)")
    return names


def test_core_has_files() -> None:
    assert list(CORE.glob("*.py"))


def test_core_imports_no_home_assistant() -> None:
    offenders = {
        f"{path.name}: {module}"
        for path in CORE.rglob("*.py")
        for module in _imported_modules(path)
        if module.split(".")[0] == "homeassistant" or module.endswith("(outside the core)")
    }
    assert not offenders
