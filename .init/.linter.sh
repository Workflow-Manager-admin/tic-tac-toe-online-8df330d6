#!/bin/bash
cd /home/kavia/workspace/code-generation/tic-tac-toe-online-8df330d6/frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

