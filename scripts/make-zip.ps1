# Zips out/ into saathi-hostinger.zip with forward-slash entry names
# (PowerShell's Compress-Archive writes backslashes, which break on Linux hosts).
#   powershell -File scripts/make-zip.ps1
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "out"
$zip = Join-Path $root "saathi-hostinger.zip"
if (Test-Path $zip) { [System.IO.File]::Delete($zip) }

$archive = [System.IO.Compression.ZipFile]::Open($zip, [System.IO.Compression.ZipArchiveMode]::Create)
$count = 0
Get-ChildItem -Path $src -Recurse -File -Force | ForEach-Object {
  $rel = $_.FullName.Substring($src.Length + 1).Replace([char]92, [char]47)
  [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal)
  $count++
}
$archive.Dispose()

$check = [System.IO.Compression.ZipFile]::OpenRead($zip)
$names = @($check.Entries | ForEach-Object { $_.FullName })
$check.Dispose()
"entries: $count"
"size MB: " + [math]::Round((Get-Item $zip).Length / 1MB, 2)
"backslash entries: " + @($names | Where-Object { $_.Contains([string][char]92) }).Count
"root files: " + (@($names | Where-Object { -not $_.Contains("/") }) -join ", ")
"has prototype/saathi/index.html: " + ($names -contains "prototype/saathi/index.html")
