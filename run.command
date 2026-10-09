#!/bin/bash
# CampusConnect — macOS Direct Terminal & Browser Launcher
cd "$(dirname "$0")"

# Bring macOS Terminal directly to the front
osascript -e 'tell application "Terminal" to activate'

# Automatically open default web browser after 1.5s
(sleep 1.5 && open "http://localhost:5173/") &

echo "========================================================"
echo " CampusConnect Smart Education Platform"
echo "========================================================"
echo ""
echo "Terminal is active. Local development server starting..."
echo "Opening web browser automatically at http://localhost:5173/ ..."
echo ""

npm run dev
