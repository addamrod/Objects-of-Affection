#!/bin/zsh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Pulling latest changes..."
git -C "$PROJECT_DIR" pull origin main

echo "Opening VS Code..."
code "$PROJECT_DIR"

echo "Starting dev server in new terminal window..."
osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR' && npm run dev\""

echo "Opening URLs in Chrome..."
open -a "Google Chrome" \
    "http://localhost:3000" \
    "http://localhost:3000/admin" \
    "https://objects-of-affection.vercel.app" \
    "https://vercel.com" \
    "https://github.com/addamrod/Objects-of-Affection"

echo "Session started."
