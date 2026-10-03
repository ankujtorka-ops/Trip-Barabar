# Trip Barabar - Lightweight Local Web Server
# Works on any Windows machine with zero software installation

$port = 8090
$folder = $PSScriptRoot

# Find Local IP Address for mobile access on same Wi-Fi
$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254*" } | Select-Object -First 1).IPAddress
if (-not $localIp) { $localIp = "localhost" }

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       🌴 TRIP BARABAR (MOBILE & PC SERVER)            " -ForegroundColor Green
Write-Host "       Tagline: Trip Sorted. Hisaab Barabar.            " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Server started successfully!" -ForegroundColor Green
Write-Host "Laptop / PC URL : http://localhost:$port" -ForegroundColor White
Write-Host "Mobile Phone URL: http://$($localIp):$port" -ForegroundColor Yellow
Write-Host "(Open the Mobile URL on your iPhone/Android on the same Wi-Fi)" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the server anytime." -ForegroundColor DarkGray
Write-Host "========================================================" -ForegroundColor Cyan

# Launch default browser
Start-Process "http://localhost:$port"

# Start HTTP Listener on localhost
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
if ($localIp -and $localIp -ne "localhost") {
    try {
        $listener.Prefixes.Add("http://$($localIp):$port/")
    } catch {
        # Fallback if specific IP binding requires elevation
    }
}
$listener.Start()

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or [string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "/index.html"
        }

        $filePath = Join-Path $folder ($urlPath.TrimStart("/").Replace("/", "\"))

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".json" { $response.ContentType = "application/json; charset=utf-8" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                Default { $response.ContentType = "application/octet-stream" }
            }

            # Enable CORS & caching headers
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache")
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("File Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # Catch unexpected errors to keep listener running
    }
}
