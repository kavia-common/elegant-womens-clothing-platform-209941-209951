#!/bin/bash
cd /home/kavia/workspace/code-generation/elegant-womens-clothing-platform-209941-209951/frontend_react_js
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

