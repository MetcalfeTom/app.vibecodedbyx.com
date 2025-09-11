#!/bin/bash

# Local development script - runs all apps in parallel
# Use this for testing before deploying to Hetzner

echo "=== Starting Vibe Apps Locally ==="

# Add bun to PATH if it exists in home directory
if [ -d "$HOME/.bun/bin" ]; then
    export PATH="$HOME/.bun/bin:$PATH"
fi

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "Bun not found. Installing..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    
    # Check again after install
    if ! command -v bun &> /dev/null; then
        echo "Error: Failed to install Bun"
        exit 1
    fi
fi

echo "Using Bun: $(which bun)"

# Kill any existing Bun processes running our apps
echo "Stopping any existing app processes..."
pkill -f "bun run server.ts" 2>/dev/null || true
pkill -f "bun.*server.ts" 2>/dev/null || true

# Also kill by port to be sure
for port in 3000 3001 3002; do
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
done

# Wait a moment for processes to fully terminate
sleep 1

# Index page is now served by nginx in production; no local index app

# Install dependencies and start each app (except index)
port=3001
for app_dir in apps/*/; do
    app_name=$(basename $app_dir)
    
    # Skip index app (already started)
    if [ "$app_name" = "index" ]; then
        continue
    fi
    
    if [ -f "$app_dir/server.ts" ]; then
        echo "Starting $app_name on port $port..."
        
        # Install dependencies if needed
        (cd "$app_dir" && {
            if [ ! -f "package.json" ]; then
                cat > package.json << 'EOF'
{
  "name": "app",
  "dependencies": {
    "hono": "latest"
  }
}
EOF
            fi
            
            if [ ! -d "node_modules" ]; then
                bun install
            fi
            
            # Start the app
            PORT=$port bun run server.ts &
        })
        
        ((port++))
    fi
done

echo ""
echo "=== Apps are starting up... ==="
echo ""
echo "Apps start at: http://localhost:3001 (then 3002, 3003, ...)"
echo ""
echo "Press Ctrl+C to stop all apps"

# Wait for Ctrl+C
trap 'kill $(jobs -p) 2>/dev/null; echo "All apps stopped"; exit' INT
wait
