param(
  [switch]$Sync,
  [switch]$Package
)
$ErrorActionPreference = "Stop"
$repo = Join-Path $env:USERPROFILE "Documents\GitHub\The_MODerator"
if (!(Test-Path (Join-Path $repo ".git"))) { throw "HOMEPC MODerator checkout unavailable: $repo" }
Push-Location $repo
try {
  $dirty = @(git status --porcelain)
  if ($LASTEXITCODE -ne 0) { throw "Git working tree inspection failed." }
  if ($dirty.Count -gt 0) { throw "Worktree has uncommitted changes; sync aborted to avoid overwrites." }
  if ($Sync) {
    git switch main
    if ($LASTEXITCODE -ne 0) { throw "Could not switch to main; no reset attempted." }
    git fetch --prune origin
    if ($LASTEXITCODE -ne 0) { throw "Git fetch failed." }
    git merge --ff-only origin/main
    if ($LASTEXITCODE -ne 0) { throw "Not a fast-forward. Manual reconciliation required; no reset attempted." }
    npm ci
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed." }
  }
  $head = (git rev-parse HEAD)
  Write-Output "VERIFIED_HEAD=$head"
  npm run typecheck
  if ($LASTEXITCODE -ne 0) { throw "Typecheck failed." }
  npm run gauntlet
  if ($LASTEXITCODE -ne 0) { throw "Gauntlet failed." }
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "Build failed." }
  if ($Package) {
    npm run desktop:pack
    if ($LASTEXITCODE -ne 0) { throw "Private Windows packaging failed." }
    $env:MODERATOR_SMOKE_TEST = "1"
    try {
      & (Join-Path $repo "release\win-unpacked\MODerator Desktop.exe")
      if ($LASTEXITCODE -ne 0) { throw "Packaged smoke failed." }
    } finally { Remove-Item Env:MODERATOR_SMOKE_TEST -ErrorAction SilentlyContinue }
    $receipt = Join-Path $env:APPDATA "moderator-desktop\desktop-smoke.json"
    $smoke = Get-Content $receipt -Raw | ConvertFrom-Json
    if ($smoke.code -ne 0 -or !$smoke.result.footballBoardReady -or
        !$smoke.result.passBoard -or !$smoke.result.runBoard -or
        !$smoke.result.modSpecV2Ready) { throw "Football22 interaction acceptance failed." }
    Write-Output "PACKAGED_FOOTBALL22_SMOKE=PASS"
  }
  Write-Output "HOMEPC_QA_STATUS=PASS"
  git status --short
} finally { Pop-Location }
