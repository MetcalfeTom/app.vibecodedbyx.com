#!/bin/bash

echo "=== Fixing App Setup ==="
echo ""

# Kill all existing bun processes
echo "Stopping all existing servers..."
for pid in $(pgrep -f "bun run server.ts"); do
    kill $pid 2>/dev/null
done
sleep 2

# Start each app in its correct directory
echo "Starting apps in correct directories..."
echo ""

# Map of apps to ports
declare -A app_ports=(
    ["leaderboard"]=3000
    ["snake"]=3001
    ["tetris"]=3002
    ["rockpaperscissors"]=3003
    ["banana"]=3004
    ["kiwi"]=3005
    ["strawberry"]=3006
    ["orange"]=3007
    ["grape"]=3008
    ["grok"]=3009
    ["business"]=3010
    ["palmtrees"]=3011
    ["pineapple"]=3012
)

# Start each app
for app in "${!app_ports[@]}"; do
    port=${app_ports[$app]}
    app_dir="apps/$app"
    
    if [ -d "$app_dir" ] && [ -f "$app_dir/server.ts" ]; then
        echo "Starting $app on port $port..."
        (cd "$app_dir" && bun run server.ts > /dev/null 2>&1 &)
        sleep 0.5
    fi
done

echo ""
echo "Waiting for apps to stabilize..."
sleep 3

# Verify each app
echo ""
echo "=== Verification ==="
for app in "${!app_ports[@]}"; do
    port=${app_ports[$app]}
    path_num=$(printf "%03d" $((port - 3000)))
    
    # Check if port is listening
    if lsof -i :$port > /dev/null 2>&1; then
        # Check content
        title=$(curl -s "http://localhost:$port/" 2>/dev/null | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g')
        echo "✓ $app (port $port, /$path_num/): $title"
    else
        echo "✗ $app (port $port) - NOT RUNNING"
    fi
done

echo ""
echo "Done! Apps should now be accessible at their correct paths."