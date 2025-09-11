#!/bin/bash

# Quick validation script to run after each push
echo "Running quick validation..."

# Check JavaScript syntax for all games
echo -n "Checking JavaScript syntax... "
ERROR_COUNT=0
for file in apps/*/public/game.js; do
    if [ -f "$file" ]; then
        if ! node -c "$file" 2>/dev/null; then
            echo ""
            echo "  ✗ Syntax error in $file"
            ((ERROR_COUNT++))
        fi
    fi
done

if [ $ERROR_COUNT -eq 0 ]; then
    echo "✓ All JS files valid"
else
    echo "✗ Found $ERROR_COUNT files with syntax errors"
    exit 1
fi

# Check that all apps have required files
echo -n "Checking app structure... "
MISSING=0
for app in snake tetris rockpaperscissors banana kiwi strawberry orange grape pineapple; do
    if [ ! -f "apps/$app/server.ts" ]; then
        echo ""
        echo "  ✗ Missing server.ts in $app"
        ((MISSING++))
    fi
    if [ ! -f "apps/$app/public/index.html" ]; then
        echo ""
        echo "  ✗ Missing index.html in $app"
        ((MISSING++))
    fi
done

if [ $MISSING -eq 0 ]; then
    echo "✓ All apps have required files"
else
    echo "✗ Found $MISSING missing files"
    exit 1
fi

# Quick port check
echo -n "Checking critical ports... "
PORTS_OK=true
for port in 3000 3001 3002 3003; do
    if ! lsof -i:$port > /dev/null 2>&1; then
        echo ""
        echo "  ⚠ Port $port not in use"
        PORTS_OK=false
    fi
done

if [ "$PORTS_OK" = true ]; then
    echo "✓ Critical ports active"
fi

echo ""
echo "✓ Quick validation complete"