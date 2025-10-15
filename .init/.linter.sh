#!/bin/bash
cd /home/kavia/workspace/code-generation/gemini-chatbot-platform-149385-149395/chatbot_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

