@echo off
cd /d "%~dp0"
echo Building Windows installer...
npm run build
echo.
echo Installer is in the release\ folder.
pause
