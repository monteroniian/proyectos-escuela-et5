@echo off
cd /d "%~dp0backend"
start "" /B "%~dp0node_portable\node.exe" server.js
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"
