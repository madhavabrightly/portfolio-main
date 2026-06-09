param(
  [int]$Port = 8000
)
Set-Location $PSScriptRoot
Write-Output "Serving $PSScriptRoot at http://localhost:$Port"
python -m http.server $Port
