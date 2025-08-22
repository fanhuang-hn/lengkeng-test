#!/bin/bash

# Local test runner script for lengkeng-test
# Usage: ./run-tests.sh [options]

set -e

echo "🚀 Lengkeng Login Test Runner"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Check if browsers are installed
if ! npx playwright --version > /dev/null 2>&1; then
    print_error "Playwright not found. Installing..."
    npm install @playwright/test playwright
fi

# Install browsers if needed
print_status "Checking browser installations..."
if ! npx playwright install --dry-run chromium > /dev/null 2>&1; then
    print_status "Installing Playwright browsers..."
    npx playwright install chromium firefox webkit || {
        print_warning "Failed to install all browsers. Trying chromium only..."
        npx playwright install chromium
    }
fi

# Parse command line arguments
HEADED=""
DEBUG=""
BROWSER=""
UI=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --headed|-h)
            HEADED="--headed"
            shift
            ;;
        --debug|-d)
            DEBUG="--debug"
            shift
            ;;
        --ui|-u)
            UI="--ui"
            shift
            ;;
        --browser|-b)
            BROWSER="--project=$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --headed, -h     Run tests in headed mode (show browser)"
            echo "  --debug, -d      Run tests in debug mode"
            echo "  --ui, -u         Run tests in UI mode"
            echo "  --browser, -b    Specify browser (chromium, firefox, webkit)"
            echo "  --help           Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                    # Run all tests headless"
            echo "  $0 --headed          # Run with browser visible"
            echo "  $0 --browser chromium # Run only on Chromium"
            echo "  $0 --debug           # Run in debug mode"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Create test-results directory
mkdir -p test-results

# Check connectivity first
print_status "Checking connectivity to test site..."
if curl -I --connect-timeout 5 --max-time 10 http://lengkeng-dev.hocai.fun/ > /dev/null 2>&1; then
    print_success "Test site is accessible"
else
    print_warning "Test site may not be accessible. Tests might fail due to network issues."
fi

# Build the test command
TEST_CMD="npx playwright test"

if [ ! -z "$HEADED" ]; then
    TEST_CMD="$TEST_CMD $HEADED"
fi

if [ ! -z "$DEBUG" ]; then
    TEST_CMD="$TEST_CMD $DEBUG"
fi

if [ ! -z "$UI" ]; then
    TEST_CMD="$TEST_CMD $UI"
fi

if [ ! -z "$BROWSER" ]; then
    TEST_CMD="$TEST_CMD $BROWSER"
fi

# Run the tests
print_status "Running tests with command: $TEST_CMD"
echo ""

if eval $TEST_CMD; then
    print_success "Tests completed successfully!"
    
    # Check if report exists and offer to open it
    if [ -d "playwright-report" ] && [ ! "$DEBUG" ] && [ ! "$UI" ]; then
        echo ""
        print_status "Test report generated. To view it, run:"
        echo "  npm run test:report"
        echo ""
        print_status "Screenshots saved in: test-results/"
    fi
else
    print_error "Tests failed!"
    echo ""
    print_status "To debug failures:"
    echo "  $0 --debug          # Run in debug mode"
    echo "  $0 --headed         # See browser actions"
    echo "  npm run test:report # View detailed report"
    exit 1
fi