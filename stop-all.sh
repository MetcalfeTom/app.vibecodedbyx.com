#!/bin/bash

# STOP ALL SERVICES SCRIPT
echo "=========================================="
echo "STOPPING ALL SERVICES - FLEET RETURNING TO PORT!"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

STOPPED=0

# Stop services from PID file
if [ -f /tmp/services.pid ]; then
    echo "Stopping tracked services..."
    while IFS=':' read -r pid name port; do
        if kill -0 $pid 2>/dev/null; then
            echo -e "${YELLOW}Stopping $name (PID: $pid)...${NC}"
            kill $pid 2>/dev/null
            ((STOPPED++))
            echo -e "${GREEN}✓ $name stopped${NC}"
        fi
    done < /tmp/services.pid
    rm -f /tmp/services.pid
fi

# Also kill any bun processes on ports 3000-3999 (cleanup)
echo ""
echo "Cleaning up any remaining services on ports 3000-3999..."
for port in {3000..3020}; do
    pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo -e "${YELLOW}Stopping process on port $port...${NC}"
        echo "$pids" | xargs -r kill -9 2>/dev/null
        ((STOPPED++))
    fi
done

echo ""
echo "=========================================="
echo -e "${GREEN}COMPLETE!${NC} Stopped $STOPPED services"
echo "=========================================="

exit 0