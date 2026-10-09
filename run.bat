@echo off
title CampusConnect - Smart Education Platform
cd /d "%~dp0"

echo ========================================================
echo  CampusConnect Smart Education Platform Launcher
echo ========================================================
echo.
echo Starting local development server...
echo Opening web browser at http://localhost:5173/ ...
echo.

start "" "http://localhost:5173/"
npm run dev

if %ERRORLEVEL% neq 0 (
    echo.
    echo Server stopped with error code %ERRORLEVEL%.
    pause
)
