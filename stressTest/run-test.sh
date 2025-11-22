#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default values
BASE_URL="${BASE_URL:-http://localhost:3001}"
TEST_TYPE="${1:-smoke}"

echo -e "${YELLOW}╔════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║   DESA API Stress Test Runner (k6)    ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"
echo -e "Base URL: ${YELLOW}$BASE_URL${NC}"
echo ""

# Function to run k6 test
run_k6_test() {
    local test_file=$1
    local test_name=$2

    echo -e "${YELLOW}Running $test_name...${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    docker run --rm \
        --network host \
        -v "$(pwd):/k6" \
        -e BASE_URL="$BASE_URL" \
        grafana/k6:latest \
        run "/k6/$test_file"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $test_name completed successfully${NC}"
    else
        echo -e "${RED}✗ $test_name failed${NC}"
        return 1
    fi
    echo ""
}

# Run tests based on argument
case "$TEST_TYPE" in
    smoke)
        run_k6_test "smoke-test.js" "Smoke Test"
        ;;
    peraturan)
        run_k6_test "peraturanTest.js" "Peraturan Stress Test"
        ;;
    *)
        echo -e "${RED}✗ Invalid test type: $TEST_TYPE${NC}"
        echo ""
        echo "Usage: $0 [smoke|assets|damage-reports|combined|all]"
        echo ""
        echo "Examples:"
        echo "  $0 smoke              # Run smoke test (quick validation)"
        echo "  $0 peraturan             # Run assets stress test"
        echo ""
        echo "Environment variables:"
        echo "  BASE_URL=http://localhost:3001  # Default API URL"
        exit 1
        ;;
esac

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       All tests completed!             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
