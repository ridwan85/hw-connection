#!/bin/bash
pm2 serve
cd qr-generator
pm2 start index.js
cd ..
pm2 start ws-receipt.js