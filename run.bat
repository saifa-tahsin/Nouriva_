@echo off
setlocal
cd /d "%~dp0"
title Nouriva Dashboard
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not on PATH.
  echo Install Node.js 18 or newer from https://nodejs.org/
  echo Then close and reopen this file.
  pause
  exit /b 1
)
echo.
echo ========================================
echo   Nouriva Dashboard - Feature 1 + 4 AI
echo ========================================
echo.
if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo Created .env. Open it and add your Gemini API key, then run run.bat again.
  notepad ".env"
  pause
  exit /b 0
)
findstr /C:"GEMINI_API_KEY=" ".env" >nul
if errorlevel 1 echo Note: GEMINI_API_KEY setting was not found in .env.
echo Starting local server at http://localhost:3000 ...
echo Keep this window open while using Nouriva. Press Ctrl+C to stop.
start "" http://localhost:3000
node server.js
pause
