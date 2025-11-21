#!/bin/bash

# AI Personal Assistant - Docker Startup Script

set -e

echo "🚀 Starting AI Personal Assistant (Development Mode)..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
    echo "❌ Error: docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Use 'docker compose' if available, otherwise 'docker-compose'
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Parse arguments
DETACHED=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--detached)
            DETACHED="-d"
            shift
            ;;
        -h|--help)
            echo "Usage: ./start.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -d, --detached Run in background (detached mode)"
            echo "  -h, --help     Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./start.sh           # Start with logs in foreground"
            echo "  ./start.sh -d        # Start in background"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo "📦 Mode: Development (with hot-reload)"
echo "🔨 Building and starting services..."
echo ""

# Build and start services
if [ -n "$DETACHED" ]; then
    $DOCKER_COMPOSE up --build $DETACHED
    echo ""
    echo "✅ Services started in background!"
    echo ""
    echo "📊 Check status: $DOCKER_COMPOSE ps"
    echo "📋 View logs: $DOCKER_COMPOSE logs -f"
    echo "🛑 Stop services: $DOCKER_COMPOSE down"
else
    $DOCKER_COMPOSE up --build
fi

echo ""
echo "🎉 AI Personal Assistant is running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the services"
