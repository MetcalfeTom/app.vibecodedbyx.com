#!/bin/bash

# Script to start all apps after a push or restart

echo "=== Starting All Apps ==="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Kill any existing bun processes first (optional, uncomment if needed)
# echo "Stopping existing apps..."
# pkill -f "bun run server.ts"
# sleep 2

# Start each app
for app in apps/*/; do
    app_name=$(basename "$app")
    
    if [ -f "$app/server.ts" ]; then
        echo -n "Starting $app_name... "
        
        # Change to app directory and start server
        cd "$app"
        
        # Install dependencies if needed
        if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
            bun install > /dev/null 2>&1
        fi
        
        # Start the server in background
        bun run server.ts > /dev/null 2>&1 &
        
        # Check if it started
        sleep 1
        port=$(grep -oE "PORT \|\| 3[0-9]{3}" server.ts | grep -oE "3[0-9]{3}")
        if [ -n "$port" ] && lsof -i :$port > /dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} Started on port $port"
        else
            echo -e "${RED}✗${NC} Failed to start"
        fi
        
        cd - > /dev/null
    else
        echo "Skipping $app_name (no server.ts)"
    fi
done

echo ""
echo "All apps started. Run 'scripts/test-after-push.sh' to verify."