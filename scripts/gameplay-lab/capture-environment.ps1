param(
  [string]$GameExe = "C:\Program Files\EA Games\EA SPORTS College Football 27\CollegeFB27.exe",
  [string]$Out = ".\pile-leap-environment.json"
)
$ErrorActionPreference = "Stop"
if (-not (Test-Path $GameExe)) { throw "Game executable not found: $GameExe" }
$hash = Get-FileHash -Algorithm SHA256 $GameExe
$item = Get-Item $GameExe
$ac = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -match "EAAntiCheat|EAAntiCheat.GameServiceLauncher|Javelin" } | Select-Object ProcessName,Id
$payload = [ordered]@{
  capturedAt = (Get-Date).ToString("o")
  gameExe = $item.FullName
  size = $item.Length
  sha256 = $hash.Hash
  antiCheatProcesses = @($ac)
  writeAuthority = "UNRESOLVED_UNTIL_MATCHED_TO_CERTIFIED_BUILD_REGISTRY"
  note = "Read-only environment capture. This script does not patch, launch, or write game memory."
}
$payload | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 $Out
Write-Host "Wrote $Out"
$payload | ConvertTo-Json -Depth 5