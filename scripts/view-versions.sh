#!/bin/sh
# Read-only npm registry metadata lookups for version selection.
for p in "$@"; do
  v=$(npm view "$p" version 2>/dev/null)
  echo "$p => $v"
done
