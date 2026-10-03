#!/bin/sh
set -eu

script_directory=${0%/*}
if [ "$script_directory" = "$0" ]; then script_directory=.; fi
project_root=$(CDPATH= cd "$script_directory/.." && pwd)
IFS= read -r node_required < "$project_root/.node-version"
npm_required=
while IFS= read -r line; do
  case "$line" in
    *'"packageManager":'*)
      npm_required=${line#*npm@}
      npm_required=${npm_required%%\"*}
      break
      ;;
  esac
done < "$project_root/package.json"
: "${npm_required:?packageManager must declare the npm baseline}"

if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' "Node.js $node_required is required but node is not on PATH." >&2
  printf '%s\n' "Install or select Node.js $node_required with your Node version manager or installer, open a new shell, then rerun: /bin/sh scripts/preflight.sh" >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  printf '%s\n' "npm $npm_required is required but npm is not on PATH." >&2
  printf '%s\n' "Install or select npm $npm_required with your Node toolchain, ensure npm is on PATH, then rerun: /bin/sh scripts/preflight.sh" >&2
  exit 1
fi

cd "$project_root"
exec npm run preflight
