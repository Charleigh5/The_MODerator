param([ValidatePattern('^([01][0-9]|2[0-3]):[0-5][0-9]$')][string]$At='09:00',[switch]$Remove)
$ErrorActionPreference='Stop'
$task='MODerator_Madden27_Mod_Watch'
if($Remove){
 Unregister-ScheduledTask -TaskName $task -Confirm:$false -ErrorAction SilentlyContinue
 Write-Output "REMOVED $task"
 exit 0
}
$source=Split-Path -Parent $MyInvocation.MyCommand.Path
$dest=Join-Path (Join-Path $env:APPDATA 'moderator-desktop') 'watch-runtime'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
foreach($name in @('collector.mjs','cli.mjs')){
 Copy-Item -LiteralPath (Join-Path $source $name) -Destination (Join-Path $dest $name) -Force
}
$node=Join-Path (Join-Path $env:ProgramFiles 'nodejs') 'node.exe'
if(!(Test-Path $node)){$node=(Get-Command node.exe -ErrorAction Stop).Source}
$arguments='"'+(Join-Path $dest 'cli.mjs')+'"'
$action=New-ScheduledTaskAction -Execute $node -Argument $arguments -WorkingDirectory $dest
$trigger=New-ScheduledTaskTrigger -Daily -At $At
$principal=New-ScheduledTaskPrincipal -UserId ([Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited
$settings=New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 10) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName $task -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force | Out-Null
$info=Get-ScheduledTaskInfo -TaskName $task
Write-Output "REGISTERED $task AT=$At RUNTIME=$dest NEXT=$($info.NextRunTime)"
Write-Output "NOTE: Interactive user session required; task is read-only on upstream sites, writes local metadata snapshots only."
