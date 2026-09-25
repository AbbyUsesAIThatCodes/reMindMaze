@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
  start "" http://localhost:4173
  node scripts/serve.mjs
  goto :end
)
where py >nul 2>nul
if %errorlevel% equ 0 (
  start "" http://localhost:4173
  py -3 -m http.server 4173 --bind 127.0.0.1
  goto :end
)
echo Install Node.js 20 or newer, or Python 3, then run this file again.
pause
:end
