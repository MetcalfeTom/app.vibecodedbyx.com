#!/bin/bash

# Comprehensive testing script for all apps
# Tests functionality, not just connectivity

echo "=== Comprehensive App Testing ==="
echo "Testing at $(date)"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0
SKIPPED=0

# Function to test an app endpoint
test_endpoint() {
    local url=$1
    local name=$2
    local expected_content=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s "$url" 2>/dev/null)
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$http_code" != "200" ]; then
        echo -e "${RED}✗${NC} HTTP $http_code"
        ((FAILED++))
        return 1
    fi
    
    if [ -n "$expected_content" ]; then
        if echo "$response" | grep -q "$expected_content"; then
            echo -e "${GREEN}✓${NC} Content OK"
            ((PASSED++))
            return 0
        else
            echo -e "${YELLOW}⚠${NC} Missing expected content: $expected_content"
            ((FAILED++))
            return 1
        fi
    else
        echo -e "${GREEN}✓${NC} HTTP 200"
        ((PASSED++))
        return 0
    fi
}

# Function to test game functionality
test_game() {
    local port=$1
    local path=$2
    local game_name=$3
    local check_for=$4
    
    echo -e "\n${BLUE}Testing $game_name (port $port, path $path)${NC}"
    
    # Test main page
    test_endpoint "http://localhost:$port/" "$game_name main page" "$check_for"
    
    # Test via nginx proxy
    test_endpoint "http://localhost/$path/" "$game_name via nginx" "$check_for"
    
    # Test static resources
    test_endpoint "http://localhost:$port/static/style.css" "$game_name CSS" ""
    
    # Test API endpoints if applicable
    if [ "$game_name" != "Leaderboard" ] && [ "$game_name" != "Business" ] && [ "$game_name" != "Grok" ]; then
        test_endpoint "http://localhost:$port/api/highscores" "$game_name highscores API" ""
    fi
}

echo "=== Individual App Tests ==="

# Test each game
test_game 3000 "000" "Leaderboard" "<h1>🏆 Global Leaderboard</h1>"
test_game 3001 "001" "Snake" "canvas"
test_game 3002 "002" "Tetris" "canvas"
test_game 3003 "003" "Rock Paper Scissors" "Rock"
test_game 3004 "004" "Banana" "banana"
test_game 3005 "005" "Kiwi" "kiwi"
test_game 3006 "006" "Strawberry" "strawberry"
test_game 3007 "007" "Orange" "orange"
test_game 3008 "008" "Grape" "grape"
test_game 3009 "009" "Grok" "Grok"
test_game 3010 "010" "Business" "Cloud Biz"
test_game 3011 "011" "Palm Trees" "palm"
test_game 3012 "012" "Pineapple" "pineapple"

echo -e "\n=== JavaScript Console Error Check ==="

# Check for JavaScript errors (using headless browser if available)
if command -v node &> /dev/null; then
    echo "Checking for JavaScript errors in apps..."
    
    cat > /tmp/test-js.js << 'EOF'
const puppeteer = require('puppeteer-core');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        args: ['--no-sandbox']
    });

    const apps = [
        {url: 'http://localhost/000/', name: 'Leaderboard'},
        {url: 'http://localhost/001/', name: 'Snake'},
        {url: 'http://localhost/002/', name: 'Tetris'}
    ];

    for (const app of apps) {
        const page = await browser.newPage();
        const errors = [];
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        page.on('pageerror', err => {
            errors.push(err.message);
        });
        
        await page.goto(app.url, {waitUntil: 'networkidle2'});
        
        if (errors.length > 0) {
            console.log(`${app.name}: ${errors.length} errors`);
            errors.forEach(e => console.log(`  - ${e}`));
        } else {
            console.log(`${app.name}: No errors`);
        }
        
        await page.close();
    }

    await browser.close();
})();
EOF

    if command -v puppeteer &> /dev/null; then
        node /tmp/test-js.js 2>/dev/null || echo "Puppeteer not available for JS testing"
    else
        echo "Puppeteer not installed - skipping JavaScript error tests"
    fi
else
    echo "Node.js not available - skipping JavaScript tests"
fi

echo -e "\n=== Database Connectivity Tests ==="

# Test database files
for db_file in apps/*/*.db; do
    if [ -f "$db_file" ]; then
        app_name=$(basename $(dirname "$db_file"))
        echo -n "Database for $app_name: "
        
        if sqlite3 "$db_file" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" &> /dev/null; then
            table_count=$(sqlite3 "$db_file" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
            echo -e "${GREEN}✓${NC} $table_count tables"
            ((PASSED++))
        else
            echo -e "${RED}✗${NC} Cannot read database"
            ((FAILED++))
        fi
    fi
done

echo -e "\n=== Performance Tests ==="

# Test response times
for path in 000 001 002 003; do
    echo -n "Response time /$path/: "
    time=$(curl -s -o /dev/null -w "%{time_total}" "http://localhost/$path/")
    time_ms=$(echo "$time * 1000" | bc)
    
    if (( $(echo "$time < 0.5" | bc -l) )); then
        echo -e "${GREEN}✓${NC} ${time_ms}ms"
        ((PASSED++))
    elif (( $(echo "$time < 1.0" | bc -l) )); then
        echo -e "${YELLOW}⚠${NC} ${time_ms}ms (slow)"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} ${time_ms}ms (too slow)"
        ((FAILED++))
    fi
done

echo -e "\n=== Memory Usage Check ==="

# Check memory usage of bun processes
total_mem=0
for pid in $(pgrep -f "bun run server.ts"); do
    if [ -n "$pid" ]; then
        mem=$(ps -o rss= -p $pid 2>/dev/null | tr -d ' ')
        if [ -n "$mem" ]; then
            mem_mb=$((mem / 1024))
            total_mem=$((total_mem + mem_mb))
        fi
    fi
done

echo "Total memory usage by all apps: ${total_mem}MB"
if [ $total_mem -lt 500 ]; then
    echo -e "${GREEN}✓${NC} Memory usage is reasonable"
    ((PASSED++))
elif [ $total_mem -lt 1000 ]; then
    echo -e "${YELLOW}⚠${NC} Memory usage is high"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Memory usage is excessive"
    ((FAILED++))
fi

echo -e "\n=== Test Summary ==="
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo -e "${YELLOW}Skipped:${NC} $SKIPPED"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}Some tests failed. Please review and fix.${NC}"
    exit 1
fi