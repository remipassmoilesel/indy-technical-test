#!/usr/bin/env bash

set -e

echo
echo "  ⚙️ ⚙️"

npm run build
npm run lint
npm run test

echo
echo "  👌 🚀"