# Run scripts/check inside WSL from Windows, where Home Assistant cannot run.
#   powershell -File scripts\wsl-check.ps1 [lint|types|test ARGS|all]
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
wsl.exe -d Ubuntu --cd $repo -- bash scripts/check @args
exit $LASTEXITCODE
