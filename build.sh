#!/usr/bin/env bash
# Rebuilds js/ui.min.js (Motion UI) from js/src/ui.js as a classic script (IIFE),
# so the page also works opened straight from disk. Needs Node; installs the pinned
# packages into .build/ the first time (keep .build/ out of the deployed site).
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p .build
if [ ! -d .build/node_modules/motion ]; then
  (cd .build && echo '{"name":"portfolio-build","private":true}' > package.json && npm i motion@14.6.0 esbuild@0.25.0 --silent)
fi
cp js/src/ui.js .build/
(cd .build && npx esbuild ui.js --bundle --minify --format=iife --target=es2020 --legal-comments=none --outfile=../js/ui.min.js)
echo "built js/ui.min.js"
