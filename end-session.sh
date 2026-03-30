#!/bin/zsh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$PROJECT_DIR"

echo "Staging all changes..."
git add -A

if git diff --cached --quiet; then
    echo "Nothing to commit."
    exit 0
fi

echo "Changes staged:"
git diff --cached --stat

echo ""
printf "Commit message: "
read COMMIT_MSG

if [[ -z "$COMMIT_MSG" ]]; then
    echo "Aborting: empty commit message."
    exit 1
fi

git commit -m "$COMMIT_MSG"
git push origin main

echo "Pushed to main."
