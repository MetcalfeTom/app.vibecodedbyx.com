#!/bin/bash

# Real-time monitoring script for all apps

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo "==================================="
echo "    APP MONITORING DASHBOARD       "
echo "==================================="

while true; do
    echo -e "\n[$(date '+%H:%M:%S')] Checking app status..."
    echo "-----------------------------------"
    
    # Check each app port
    for port in 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012; do
        app_name=""
        case $port in
            3000) app_name="Leaderboard" ;;
            3001) app_name="Snake" ;;
            3002) app_name="Tetris" ;;
            3003) app_name="RockPaperScissors" ;;
            3004) app_name="Banana" ;;
            3005) app_name="Kiwi" ;;
            3006) app_name="Strawberry" ;;
            3007) app_name="Orange" ;;
            3008) app_name="Grape" ;;
            3009) app_name="Grok" ;;
            3010) app_name="Business" ;;
            3011) app_name="PalmTrees" ;;
            3012) app_name="Pineapple" ;;
        esac
        
        printf "Port $port ($app_name): "
        
        if lsof -i:$port > /dev/null 2>&1; then
            # Check if responding
            response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port/" --max-time 2)
            if [ "$response" -eq 200 ]; then
                echo -e "${GREEN}✓ Running${NC}"
            else
                echo -e "${YELLOW}⚠ Running but not responding (HTTP $response)${NC}"
            fi
        else
            echo -e "${RED}✗ Not running${NC}"
        fi
    done
    
    # Memory usage
    echo -e "\n--- System Resources ---"
    echo "Memory: $(free -h | awk '/^Mem:/ {print $3 " / " $2}')"
    echo "CPU: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}')"
    
    # Count running apps
    running=$(lsof -i:3000-3012 2>/dev/null | grep LISTEN | wc -l)
    echo -e "\n${GREEN}Running apps: $running/13${NC}"
    
    echo -e "\nPress Ctrl+C to exit"
    sleep 10
done