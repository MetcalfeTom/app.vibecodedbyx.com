#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "==================================="
echo "    COMPREHENSIVE APP TESTING     "
echo "==================================="
echo ""

FAILED_TESTS=0
PASSED_TESTS=0

# Function to test a URL
test_url() {
    local url=$1
    local name=$2
    
    echo -n "Testing $name... "
    
    # Test if the endpoint responds
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" -eq 200 ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED_TESTS++))
        return 0
    else
        echo -e "${RED}✗ FAILED (HTTP $response)${NC}"
        ((FAILED_TESTS++))
        return 1
    fi
}

# Function to test API endpoint
test_api() {
    local url=$1
    local name=$2
    
    echo -n "Testing API $name... "
    
    # Test if the API responds with JSON
    response=$(curl -s "$url" | head -c 1)
    
    if [ "$response" = "{" ] || [ "$response" = "[" ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED_TESTS++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED_TESTS++))
        return 1
    fi
}

# Function to test JavaScript syntax
test_js_syntax() {
    local file=$1
    local name=$2
    
    echo -n "Testing JS syntax for $name... "
    
    if node -c "$file" 2>/dev/null; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED_TESTS++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED_TESTS++))
        return 1
    fi
}

echo "1. Testing App Endpoints"
echo "------------------------"
test_url "http://localhost/000/" "Leaderboard (port 3000)"
test_url "http://localhost/001/" "Snake (port 3001)"
test_url "http://localhost/002/" "Tetris (port 3002)"
test_url "http://localhost/003/" "Rock Paper Scissors (port 3003)"
test_url "http://localhost/004/" "Banana (port 3004)"
test_url "http://localhost/005/" "Kiwi (port 3005)"
test_url "http://localhost/006/" "Strawberry (port 3006)"
test_url "http://localhost/007/" "Orange (port 3007)"
test_url "http://localhost/008/" "Grape (port 3008)"
test_url "http://localhost/009/" "Grok (port 3009)"
test_url "http://localhost/010/" "Business (port 3010)"
test_url "http://localhost/011/" "Palm Trees (port 3011)"
test_url "http://localhost/012/" "Pineapple (port 3012)"
echo ""

echo "2. Testing API Endpoints"
echo "------------------------"
test_api "http://localhost/001/api/highscores" "Snake highscores"
test_api "http://localhost/002/api/highscores" "Tetris highscores"
test_api "http://localhost/003/api/highscores" "RPS highscores"
test_api "http://localhost/004/api/highscores" "Banana highscores"
test_api "http://localhost/005/api/highscores" "Kiwi highscores"
test_api "http://localhost/006/api/highscores" "Strawberry highscores"
test_api "http://localhost/007/api/highscores" "Orange highscores"
test_api "http://localhost/008/api/highscores" "Grape highscores"
test_api "http://localhost/000/api/global" "Global leaderboard"
echo ""

echo "3. Testing JavaScript Files"
echo "---------------------------"
test_js_syntax "apps/snake/public/game.js" "Snake"
test_js_syntax "apps/tetris/public/game.js" "Tetris"
test_js_syntax "apps/rockpaperscissors/public/game.js" "Rock Paper Scissors"
test_js_syntax "apps/banana/public/game.js" "Banana"
test_js_syntax "apps/kiwi/public/game.js" "Kiwi"
test_js_syntax "apps/strawberry/public/game.js" "Strawberry"
test_js_syntax "apps/orange/public/game.js" "Orange"
test_js_syntax "apps/grape/public/game.js" "Grape"
test_js_syntax "apps/pineapple/public/game.js" "Pineapple"
echo ""

echo "4. Testing Port Availability"
echo "----------------------------"
for port in 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012; do
    echo -n "Testing port $port... "
    if lsof -i:$port > /dev/null 2>&1; then
        echo -e "${GREEN}✓ IN USE${NC}"
        ((PASSED_TESTS++))
    else
        echo -e "${YELLOW}⚠ NOT IN USE${NC}"
        ((FAILED_TESTS++))
    fi
done
echo ""

echo "5. Testing Static Assets"
echo "------------------------"
for app in snake tetris rockpaperscissors banana kiwi strawberry orange grape pineapple; do
    echo -n "Testing $app assets... "
    if [ -f "apps/$app/public/style.css" ] && [ -f "apps/$app/public/game.js" ]; then
        echo -e "${GREEN}✓ FOUND${NC}"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}✗ MISSING${NC}"
        ((FAILED_TESTS++))
    fi
done
echo ""

echo "==================================="
echo "           TEST RESULTS            "
echo "==================================="
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}Some tests failed. Please review the output above.${NC}"
    exit 1
fi