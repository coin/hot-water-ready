"""Repairs: "Resolvido" for the faults a person has to fix (spec 4.8)."""

from typing import override

from homeassistant.components.repairs import ConfirmRepairFlow, RepairsFlow, RepairsFlowResult
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant

from .core.faults import Fault


async def async_create_fix_flow(
    hass: HomeAssistant, issue_id: str, data: dict[str, str | int | float | None] | None
) -> RepairsFlow:
    """The flow behind a fault's "Resolvido"."""
    return ResolveFaultFlow(data or {})


class ResolveFaultFlow(ConfirmRepairFlow):
    """Confirm the fault is fixed; heating may start again."""

    def __init__(self, data: dict[str, str | int | float | None]) -> None:
        """Keep which heater and which fault."""
        super().__init__()
        self._data = data

    @override
    async def async_step_confirm(
        self, user_input: dict[str, str] | None = None
    ) -> RepairsFlowResult:
        """Ask, then clear the fault."""
        if user_input is not None:
            entry = self.hass.config_entries.async_get_entry(str(self._data.get("entry_id")))
            if entry is not None and entry.state is ConfigEntryState.LOADED:
                await entry.runtime_data.async_resolve_fault(Fault(str(self._data["fault"])))
        return await super().async_step_confirm(user_input)
