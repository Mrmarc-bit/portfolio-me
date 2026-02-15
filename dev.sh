#!/bin/bash

# Portfolio Development Helper Script
# Makes common development tasks easier

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  🎨 Suntree Art Portfolio Manager${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Commands
setup() {
    print_info "Setting up project..."
    npm install
    print_success "Dependencies installed!"
    print_info "Run './dev.sh start' to begin development"
}

start() {
    print_info "Starting development server..."
    npm run dev
}

build() {
    print_info "Building for production..."
    npm run build
    print_success "Build complete! Check dist/ folder"
}

preview() {
    print_info "Starting preview server..."
    npm run preview
}

deploy() {
    print_info "Deploying to GitHub Pages..."
    npm run deploy
    print_success "Deployed successfully!"
    print_info "Visit: https://mrmarc-bit.github.io/portfolio-me"
}

clean() {
    print_info "Cleaning build artifacts..."
    rm -rf dist node_modules/.vite
    print_success "Cleaned!"
}

help() {
    echo "Available commands:"
    echo ""
    echo "  ./dev.sh setup     - Install dependencies"
    echo "  ./dev.sh start     - Start development server"
    echo "  ./dev.sh build     - Build for production"
    echo "  ./dev.sh preview   - Preview production build"
    echo "  ./dev.sh deploy    - Deploy to GitHub Pages"
    echo "  ./dev.sh clean     - Clean build artifacts"
    echo "  ./dev.sh help      - Show this help"
    echo ""
}

# Main
print_header

case "$1" in
    setup)
        setup
        ;;
    start)
        start
        ;;
    build)
        build
        ;;
    preview)
        preview
        ;;
    deploy)
        deploy
        ;;
    clean)
        clean
        ;;
    help|--help|-h|"")
        help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        help
        exit 1
        ;;
esac
