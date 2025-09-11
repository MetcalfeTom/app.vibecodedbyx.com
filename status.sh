#!/bin/bash

# SERVICE STATUS CHECK SCRIPT
echo "=========================================="
echo "SERVICE STATUS CHECK - FLEET REPORT!"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

RUNNING=0
STOPPED=0

# Function to check a service
check_service() {
    local name=$1
    local port=$2
    local dir=$3
    
    # Check if something is running on the port
    # Try curl first as lsof might not be available
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port 2>/dev/null | grep -q "[23][0-9][0-9]"; then
        pid="RUNNING"
    else
        pid=""
    fi
    
    if [ ! -z "$pid" ]; then
        echo -e "${GREEN}✓${NC} $name (port $port) - ${GREEN}RUNNING${NC}"
        ((RUNNING++))
    else
        if [ -d "$dir" ]; then
            echo -e "${RED}✗${NC} $name (port $port) - ${RED}STOPPED${NC}"
        else
            echo -e "${YELLOW}⚠${NC} $name (port $port) - ${YELLOW}NOT FOUND${NC} (directory missing)"
        fi
        ((STOPPED++))
    fi
}

echo ""
echo -e "${CYAN}Core Services:${NC}"
echo "--------------------------"
check_service "Leaderboard" 3003 "/workspace/apps/leaderboard"
check_service "Snake" 3001 "/workspace/apps/snake"
check_service "Tetris" 3002 "/workspace/apps/tetris"
check_service "RockPaperScissors" 3004 "/workspace/apps/rockpaperscissors"

echo ""
echo -e "${CYAN}Fruit Apps:${NC}"
echo "--------------------------"
check_service "Banana" 3005 "/workspace/apps/banana"
check_service "Orange" 3006 "/workspace/apps/orange"
check_service "Grape" 3007 "/workspace/apps/grape"
check_service "Strawberry" 3008 "/workspace/apps/strawberry"
check_service "Pineapple" 3009 "/workspace/apps/pineapple"
check_service "Watermelon" 3010 "/workspace/apps/watermelon"
check_service "Kiwi" 3011 "/workspace/apps/kiwi"

echo ""
echo -e "${CYAN}Other Apps:${NC}"
echo "--------------------------"
check_service "PalmTrees" 3012 "/workspace/apps/palmtrees"
check_service "Business" 3013 "/workspace/apps/business"
check_service "Grok" 3014 "/workspace/apps/grok"

echo ""
echo "=========================================="
echo -e "Summary: ${GREEN}$RUNNING running${NC}, ${RED}$STOPPED stopped${NC}"
echo "=========================================="

# Note about checking processes
echo ""
echo "Note: Using HTTP checks for service status"

# Show disk usage for logs
echo ""
echo "Log files disk usage:"
du -sh /tmp/*.log 2>/dev/null | head -5 || echo "No log files found"

exit 0