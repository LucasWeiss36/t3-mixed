$ErrorActionPreference = 'Stop'
$env:T3CODE_HOME = Join-Path $env:USERPROFILE '.t3-mixed'
$env:T3CODE_DESKTOP_DISTRO = 'munim'
$env:T3CODE_DISABLE_AUTO_UPDATE = '1'
Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
Start-Process -FilePath (Join-Path $PSScriptRoot 'T3 Mixed.exe') -WorkingDirectory $PSScriptRoot
