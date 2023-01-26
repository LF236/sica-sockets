#!/usr/bin/env bash
sleep 15

npm install

pm2 start /app/app.js
