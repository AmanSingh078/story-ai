@echo off
echo Starting AuraMeter application...

REM Start the backend server in a separate window
start cmd /k "cd /d %~dp0 && node server.js"

REM Start the frontend in another separate window
start cmd /k "cd /d %~dp0\client && npm run dev"

echo Both servers started successfully!
pause