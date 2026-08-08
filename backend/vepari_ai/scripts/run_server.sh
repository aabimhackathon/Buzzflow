#!/bin/bash
export PYTHON_PORT=8000
export ENVIRONMENT=production
echo "Starting Vepari AI Operating System Python Service..."
python3 backend/vepari_ai/main.py 8000
