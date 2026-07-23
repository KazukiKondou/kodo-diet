#!/usr/bin/env bash
set -eu
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOCK_FILE="/tmp/kodo-diet-deploy.lock"
cd "$APP_DIR"
if ! mkdir "$LOCK_FILE" 2>/dev/null; then exit 0; fi
trap 'rmdir "$LOCK_FILE"' EXIT
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
git fetch origin "$BRANCH" --quiet
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")
if [ "$LOCAL" = "$REMOTE" ]; then exit 0; fi
echo "[$(date '+%F %T')] update ${LOCAL:0:7} -> ${REMOTE:0:7}"
git merge --ff-only "origin/$BRANCH" --quiet
docker compose up -d --build
echo "[$(date '+%F %T')] done"
