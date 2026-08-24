@echo off
cd /d "%~dp0"
echo Building Windows installer and portable EXE...
npm run build
echo.
echo Build complete.
echo Installer and portable EXE are in the release\ folder.
pause
