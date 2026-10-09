@echo off
title CampusConnect - Push to GitHub
cd /d "%~dp0"

echo ========================================================
echo  Pushing CampusConnect to GitHub Repository
echo ========================================================
echo.
echo Repository: https://github.com/Sivabalan-1207/AI-powered-Student-Administrative-Management-Platform.git
echo.

if not exist ".git" (
    git init -b main
)

git remote remove origin 2>nul
git remote add origin https://github.com/Sivabalan-1207/AI-powered-Student-Administrative-Management-Platform.git

git add .
git commit -m "Update: AI-powered Student Administrative Management Platform (CampusConnect)"

echo Pushing to GitHub...
git push -u origin main

echo.
echo Done! Check your repository on GitHub.
pause
