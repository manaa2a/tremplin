#!/bin/bash
export PATH="/Users/aminemanaa/Claude/.tools/node/bin:$PATH"
cd "$(dirname "$0")"
exec node node_modules/vite/bin/vite.js --port 5173 --host
