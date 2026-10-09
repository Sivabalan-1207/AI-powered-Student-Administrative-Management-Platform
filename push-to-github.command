#!/bin/bash
# CampusConnect — One-Click GitHub Push Script
cd "$(dirname "$0")"

# Bring macOS Terminal directly to front
osascript -e 'tell application "Terminal" to activate'

echo "========================================================"
echo " Pushing CampusConnect to GitHub Repository"
echo "========================================================"
echo ""
echo "Repository: https://github.com/Sivabalan-1207/AI-powered-Student-Administrative-Management-Platform.git"
echo ""

# Initialize git if needed
if [ ! -d ".git" ]; then
    git init
    git branch -M main
fi

# Add remote origin if needed
git remote remove origin 2>/dev/null
git remote add origin https://github.com/Sivabalan-1207/AI-powered-Student-Administrative-Management-Platform.git

# Stage files & commit
git add .
git commit -m "Initial commit: AI-powered Student Administrative Management Platform (CampusConnect)"

# Push to GitHub main branch
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "Done! Check your repository on GitHub."
