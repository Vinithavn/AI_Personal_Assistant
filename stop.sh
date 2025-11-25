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

# Use 'docker compose' if available, otherwise 'docker-compose'
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
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
    $DOCKER_COMPOSE down $REMOVE_VOLUMES
else
    echo "Stopping services (data will be preserved)..."
    $DOCKER_COMPOSE down
fi

echo ""
echo "✅ Services stopped successfully!"
echo ""

if [ -z "$REMOVE_VOLUMES" ]; then
    echo "💡 Tip: Use './stop.sh -v' to remove volumes and delete all data"
fi
