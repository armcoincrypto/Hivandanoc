#!/usr/bin/env bash
# Push main to GitHub (healthyspine) and deploy to production server.
# Usage:
#   bash deploy/publish.sh                    # push + deploy (requires clean commit)
#   bash deploy/publish.sh "Your commit msg"  # commit all, push, deploy
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE="${GIT_REMOTE:-healthyspine}"
BRANCH="${GIT_BRANCH:-master}"

if [[ "${1:-}" != "" ]]; then
  git add -A
  if git diff --cached --quiet; then
    echo "==> Nothing to commit"
  else
    git -c user.name="${GIT_AUTHOR_NAME:-gagpoghosyan99}" \
        -c user.email="${GIT_AUTHOR_EMAIL:-gagpoghosyan99@users.noreply.github.com}" \
        commit -m "$1"
  fi
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: Uncommitted changes remain. Commit first or pass a message:"
  echo "  bash deploy/publish.sh \"Describe your change\""
  exit 1
fi

echo "==> Pushing $BRANCH to $REMOTE"
git -c http.postBuffer=524288000 push -u "$REMOTE" "$BRANCH"

echo "==> Deploying to server"
bash "$ROOT/deploy/deploy.sh"

echo "==> Done — code is on GitHub and live on healthyspinedoc.com"
