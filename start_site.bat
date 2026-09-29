@echo off
cd /d "%~dp0"
start "BookHaven Server" py app.py
timeout /t 3 /nobreak >nul
start http://127.0.0.1:3000/

