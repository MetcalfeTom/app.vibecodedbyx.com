#!/bin/bash

# Testing script to run after git push
# Checks app health and structure compliance

echo "=== Post-Push Testing Script ==="
echo "Running tests on $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Test 1: Check if all apps have required structure
echo "1. Checking app structure..."
for app in apps/*/; do
    app_name=$(basename "$app")
    
    # Check for server.ts
    if [ ! -f "$app/server.ts" ]; then
        echo -e "${RED}✗${NC} $app_name: Missing server.ts"
        ((ERRORS++))
    fi
    
    # Check for package.json
    if [ ! -f "$app/package.json" ]; then
        echo -e "${RED}✗${NC} $app_name: Missing package.json"
        ((ERRORS++))
    fi
    
    # Check for views directory
    if [ ! -d "$app/views" ]; then
        echo -e "${YELLOW}⚠${NC} $app_name: Missing views directory"
        ((WARNINGS++))
    fi
done

# Test 2: Check for port conflicts
echo ""
echo "2. Checking for port conflicts..."
declare -A ports
while IFS= read -r line; do
    if [[ $line =~ :([0-9]+)$ ]]; then
        port="${BASH_REMATCH[1]}"
        file=$(echo "$line" | cut -d: -f1)
        app=$(basename $(dirname "$file"))
        
        if [ -n "${ports[$port]}" ]; then
            echo -e "${RED}✗${NC} Port conflict: $port used by both $app and ${ports[$port]}"
            ((ERRORS++))
        else
            ports[$port]="$app"
        fi
    fi
done < <(grep -r "process.env.PORT || 3" apps/*/server.ts 2>/dev/null)

# Test 3: Check if apps are using relative paths
echo ""
echo "3. Checking for absolute paths in HTML..."
absolute_paths=$(grep -r 'href="/[^"]' apps/*/views/*.html 2>/dev/null | grep -v 'href="/">' | wc -l)
if [ "$absolute_paths" -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} Found $absolute_paths absolute paths in HTML files"
    grep -r 'href="/[^"]' apps/*/views/*.html 2>/dev/null | grep -v 'href="/">' | head -5
    ((WARNINGS++))
fi

# Test 4: Check if all apps are listed in index.html
echo ""
echo "4. Checking if apps are listed in index.html..."
for app in apps/*/; do
    app_name=$(basename "$app")
    if [ "$app_name" != "leaderboard" ] && [ "$app_name" != "index-app" ]; then
        if ! grep -q "$app_name" index.html 2>/dev/null; then
            echo -e "${YELLOW}⚠${NC} $app_name not found in index.html"
            ((WARNINGS++))
        fi
    fi
done

# Test 5: Check which apps are running
echo ""
echo "5. Checking running apps..."
for port in {3000..3012}; do
    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Port $port is active"
    else
        # Find which app should be on this port
        app=$(grep -l "PORT || $port" apps/*/server.ts 2>/dev/null | head -1)
        if [ -n "$app" ]; then
            app_name=$(basename $(dirname "$app"))
            echo -e "${YELLOW}⚠${NC} Port $port ($app_name) is not running"
            ((WARNINGS++))
        fi
    fi
done

# Test 6: Quick HTTP health check
echo ""
echo "6. Running HTTP health checks..."
for i in {000..012}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/$i/" 2>/dev/null)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓${NC} /$i/ responding OK"
    elif [ "$response" = "502" ]; then
        echo -e "${RED}✗${NC} /$i/ returning 502 (app not running)"
        ((ERRORS++))
    elif [ "$response" = "404" ]; then
        echo -e "${YELLOW}⚠${NC} /$i/ returning 404"
    fi
done

# Summary
echo ""
echo "=== Test Summary ==="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "Found ${RED}$ERRORS errors${NC} and ${YELLOW}$WARNINGS warnings${NC}"
    if [ $ERRORS -gt 0 ]; then
        echo "Please fix errors before pushing to production"
        exit 1
    fi
    exit 0
fi