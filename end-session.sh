#!/bin/zsh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$PROJECT_DIR"

echo "Staging all changes..."
git add -A

if git diff --cached --quiet; then
    echo "Nothing to commit."
else
    echo ""
    echo "Summary of changes:"
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
fi

echo ""
echo "Killing dev server..."
lsof -ti tcp:3000 | xargs kill -9 2>/dev/null && echo "Dev server stopped." || echo "No dev server running."

echo "Closing Chrome localhost tabs..."
osascript <<'EOF'
tell application "Google Chrome"
    repeat with w in windows
        set tabList to tabs of w
        repeat with t in tabList
            if URL of t starts with "http://localhost" then
                delete t
            end if
        end repeat
    end repeat
end tell
EOF

echo "Closing Terminal..."
osascript -e 'tell application "Terminal" to quit'
