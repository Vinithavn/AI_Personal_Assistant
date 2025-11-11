#!/bin/bash

# AI Personal Assistant - Docker Stop Script

set -e

echo "🛑 Stopping AI Personal Assistant..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running."
    exit 1
fi

# Parse arguments
REMOVE_VOLUMES=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--volumes)
            REMOVE_VOLUMES="-v"
            shift
            ;;
        -h|--help)
            echo "Usage: ./stop.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -v, --volumes  Remove volumes (deletes data)"
            echo "  -h, --help     Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./stop.sh           # Stop services, keep data"
            echo "  ./stop.sh -v        # Stop services and remove data"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Stop services
if [ -n "$REMOVE_VOLUMES" ]; then
    echo "⚠️  Stopping services and removing volumes (data will be deleted)..."
    docker-compose down $REMOVE_VOLUMES
    docker-compose -f docker-compose.dev.yml down $REMOVE_VOLUMES 2>/dev/null || true
else
    echo "Stopping services (data will be preserved)..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
fi

echo ""
echo "✅ Services stopped successfully!"
echo ""

if [ -z "$REMOVE_VOLUMES" ]; then
    echo "💡 Tip: Use './stop.sh -v' to remove volumes and delete all data"
fi
