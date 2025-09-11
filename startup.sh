#!/bin/bash

# PIRATE FLEET STARTUP SCRIPT - LAUNCHES ALL SERVICES
# ARRR! THIS SCRIPT BE ROBUST AGAINST FAILURES!

echo "=========================================="
echo "STARTING ALL SERVICES - PIRATE FLEET DEPLOY!"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to start a service
start_service() {
    local name=$1
    local dir=$2
    local port=$3
    local command=$4
    
    echo -e "${YELLOW}Starting $name on port $port...${NC}"
    
    # Check if directory exists
    if [ ! -d "$dir" ]; then
        echo -e "${RED}✗ $name: Directory $dir not found, skipping...${NC}"
        return 1
    fi
    
    # Kill any existing process on this port (cleanup)
    lsof -ti:$port 2>/dev/null | xargs -r kill -9 2>/dev/null
    
    # Start the service
    cd "$dir" 2>/dev/null
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ $name: Cannot access directory, skipping...${NC}"
        return 1
    fi
    
    # Run the command in background with nohup
    nohup bash -c "$command" > /tmp/${name}_${port}.log 2>&1 &
    local pid=$!
    
    # Give it a moment to start
    sleep 2
    
    # Check if service started by testing HTTP endpoint
    sleep 3
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port 2>/dev/null | grep -q "[23][0-9][0-9]"; then
        echo -e "${GREEN}✓ $name started successfully on port $port${NC}"
        echo "$pid:$name:$port" >> /tmp/services.pid
        return 0
    else
        echo -e "${RED}✗ $name failed to start${NC}"
        # Show last few lines of error log
        if [ -f "/tmp/${name}_${port}.log" ]; then
            echo "Error output:"
            tail -3 "/tmp/${name}_${port}.log" 2>/dev/null
        fi
        return 1
    fi
}

# Clean up old PID file
rm -f /tmp/services.pid

# Counter for successes
SUCCESS_COUNT=0
TOTAL_COUNT=0

echo ""
echo "Starting core services..."
echo "--------------------------"

# LEADERBOARD - Port 3003
((TOTAL_COUNT++))
start_service "Leaderboard" "/workspace/apps/leaderboard" 3003 "bun run server.ts" && ((SUCCESS_COUNT++))

# SNAKE GAME - Port 3001  
((TOTAL_COUNT++))
start_service "Snake" "/workspace/apps/snake" 3001 "bun run server.ts" && ((SUCCESS_COUNT++))

# TETRIS - Port 3002
((TOTAL_COUNT++))
start_service "Tetris" "/workspace/apps/tetris" 3002 "bun run server.ts" && ((SUCCESS_COUNT++))

# ROCK PAPER SCISSORS - Port 3004
((TOTAL_COUNT++))
start_service "RockPaperScissors" "/workspace/apps/rockpaperscissors" 3004 "bun run server.ts" && ((SUCCESS_COUNT++))

echo ""
echo "Starting fruit apps..."
echo "--------------------------"

# BANANA - Port 3005
((TOTAL_COUNT++))
start_service "Banana" "/workspace/apps/banana" 3005 "bun run server.ts" && ((SUCCESS_COUNT++))

# ORANGE - Port 3006
((TOTAL_COUNT++))
start_service "Orange" "/workspace/apps/orange" 3006 "bun run server.ts" && ((SUCCESS_COUNT++))

# GRAPE - Port 3007
((TOTAL_COUNT++))
start_service "Grape" "/workspace/apps/grape" 3007 "bun run server.ts" && ((SUCCESS_COUNT++))

# STRAWBERRY - Port 3008
((TOTAL_COUNT++))
start_service "Strawberry" "/workspace/apps/strawberry" 3008 "bun run server.ts" && ((SUCCESS_COUNT++))

# PINEAPPLE - Port 3009
((TOTAL_COUNT++))
start_service "Pineapple" "/workspace/apps/pineapple" 3009 "bun run server.ts" && ((SUCCESS_COUNT++))

# WATERMELON - Port 3010
((TOTAL_COUNT++))
start_service "Watermelon" "/workspace/apps/watermelon" 3010 "bun run server.ts" && ((SUCCESS_COUNT++))

# KIWI - Port 3011
((TOTAL_COUNT++))
start_service "Kiwi" "/workspace/apps/kiwi" 3011 "bun run server.ts" && ((SUCCESS_COUNT++))

echo ""
echo "Starting other apps..."
echo "--------------------------"

# PALMTREES - Port 3012
((TOTAL_COUNT++))
start_service "PalmTrees" "/workspace/apps/palmtrees" 3012 "bun run server.ts" && ((SUCCESS_COUNT++))

# BUSINESS - Port 3013
((TOTAL_COUNT++))
start_service "Business" "/workspace/apps/business" 3013 "bun run server.ts" && ((SUCCESS_COUNT++))

# GROK - Port 3014
((TOTAL_COUNT++))
start_service "Grok" "/workspace/apps/grok" 3014 "bun run server.ts" && ((SUCCESS_COUNT++))

# PIRATE BATTLE - Port 3015
((TOTAL_COUNT++))
start_service "PirateBattle" "/workspace/apps/pirate-battle" 3015 "bun run server.ts" && ((SUCCESS_COUNT++))

# TREASURE HUNT - Port 3016
((TOTAL_COUNT++))
start_service "TreasureHunt" "/workspace/apps/treasure-hunt" 3016 "bun run server.ts" && ((SUCCESS_COUNT++))

echo ""
echo "=========================================="
echo -e "${GREEN}STARTUP COMPLETE!${NC}"
echo -e "Successfully started: ${GREEN}$SUCCESS_COUNT${NC}/${TOTAL_COUNT} services"
echo "=========================================="
echo ""

# Show running services
if [ -f /tmp/services.pid ]; then
    echo "Running services:"
    echo "-----------------"
    while IFS=':' read -r pid name port; do
        if kill -0 $pid 2>/dev/null; then
            echo "✓ $name (PID: $pid) on port $port - http://localhost:$port"
        fi
    done < /tmp/services.pid
fi

echo ""
echo "Logs are available in /tmp/*_*.log"
echo "PID tracking file: /tmp/services.pid"
echo ""
echo "To stop all services, run: ./stop-all.sh"
echo "To check status, run: ./status.sh"

exit 0