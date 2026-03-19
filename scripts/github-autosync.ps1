param(
  [Parameter(Mandatory = $false)]
  [string] $RootDir = "$env:USERPROFILE\\Documents\\trae_projects",

  [Parameter(Mandatory = $false)]
  [int] $IntervalSeconds = 30,

  [Parameter(Mandatory = $false)]
  [switch] $Once
)

function Get-RepoRoots([string] $root) {
  $repos = New-Object System.Collections.Generic.List[string]
  if (-not (Test-Path -LiteralPath $root)) { return $repos }

  if (Test-Path -LiteralPath (Join-Path $root ".git")) {
    $repos.Add((Resolve-Path -LiteralPath $root).Path)
  }

  Get-ChildItem -LiteralPath $root -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
    $candidate = $_.FullName
    if (Test-Path -LiteralPath (Join-Path $candidate ".git")) {
      $repos.Add($candidate)
    }
  }

  return $repos
}

function Has-BlockingGitOp([string] $repo) {
  $gitDir = Join-Path $repo ".git"
  if (-not (Test-Path -LiteralPath $gitDir)) { return $true }

  $blockers = @(
    (Join-Path $gitDir "index.lock"),
    (Join-Path $gitDir "MERGE_HEAD"),
    (Join-Path $gitDir "rebase-apply"),
    (Join-Path $gitDir "rebase-merge"),
    (Join-Path $gitDir "CHERRY_PICK_HEAD"),
    (Join-Path $gitDir "REVERT_HEAD")
  )

  foreach ($b in $blockers) {
    if (Test-Path -LiteralPath $b) { return $true }
  }

  return $false
}

function Get-GitConfigValue([string] $repo, [string] $key) {
  $v = & git -C $repo config --get $key 2>$null
  if ($LASTEXITCODE -ne 0) { return "" }
  return [string]$v
}

function ShouldSkipBySensitiveFiles([string[]] $statusLines) {
  $sensitive = @(
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    ".pem",
    ".pfx",
    "id_rsa",
    "id_ed25519"
  )

  foreach ($line in $statusLines) {
    if (-not $line) { continue }
    if ($line.Length -lt 4) { continue }
    $path = $line.Substring(3)
    foreach ($pat in $sensitive) {
      if ($path -eq $pat -or $path.EndsWith($pat)) { return $true }
    }
  }

  return $false
}

function Sync-Repo([string] $repo) {
  if (Has-BlockingGitOp $repo) { return }

  $origin = & git -C $repo remote get-url origin 2>$null
  if ($LASTEXITCODE -ne 0) { return }

  $name = Get-GitConfigValue $repo "user.name"
  $email = Get-GitConfigValue $repo "user.email"
  if ([string]::IsNullOrWhiteSpace($name) -or [string]::IsNullOrWhiteSpace($email)) {
    Write-Output "skip: missing user.name/user.email ($repo)"
    return
  }

  $status = & git -C $repo status --porcelain 2>$null
  if ($LASTEXITCODE -ne 0) { return }
  if (-not $status) { return }

  $statusLines = @()
  if ($status -is [string]) { $statusLines = @($status) } else { $statusLines = @($status) }

  if (ShouldSkipBySensitiveFiles $statusLines) {
    Write-Output "skip: possible sensitive files in status ($repo)"
    return
  }

  & git -C $repo add -A 2>$null
  if ($LASTEXITCODE -ne 0) { return }

  & git -C $repo diff --cached --quiet
  if ($LASTEXITCODE -eq 0) { return }

  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $msg = "auto: sync $stamp"
  & git -C $repo commit -m $msg --no-gpg-sign 2>$null
  if ($LASTEXITCODE -ne 0) { return }

  & git -C $repo push 2>$null
  if ($LASTEXITCODE -ne 0) {
    & git -C $repo push -u origin HEAD 2>$null
  }
}

do {
  $repos = Get-RepoRoots $RootDir
  foreach ($r in $repos) {
    Sync-Repo $r
  }

  if ($Once) { break }
  Start-Sleep -Seconds $IntervalSeconds
} while ($true)
