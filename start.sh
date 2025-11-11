#!/bin/bash

# AI Personal Assistant - Docker Startup Script

set -e

echo "🚀 Starting AI Personal Assistant..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Parse arguments
MODE="production"
DETACHED=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --dev)
            MODE="development"
            shift
            ;;
        -d|--detached)
            DETACHED="-d"
            shift
            ;;
        -h|--help)
            echo "Usage: ./start.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --dev          Run in development mode with hot-reload"
            echo "  -d, --detached Run in background (detached mode)"
            echo "  -h, --help     Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./start.sh                    # Start in production mode"
            echo "  ./start.sh --dev              # Start in development mode"
            echo "  ./start.sh -d                 # Start in background"
            echo "  ./start.sh --dev -d           # Start in dev mode, background"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Set compose file based on mode
if [ "$MODE" = "development" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    echo "📦 Mode: Development (with hot-reload)"
else
    COMPOSE_FILE="docker-compose.simple.yml"
    echo "📦 Mode: Production"
fi

echo "🔨 Building and starting services..."
echo ""

# Build and start services
if [ -n "$DETACHED" ]; then
    docker-compose -f $COMPOSE_FILE up --build $DETACHED
    echo ""
    echo "✅ Services started in background!"
    echo ""
    echo "📊 Check status: docker-compose ps"
    echo "📋 View logs: docker-compose logs -f"
    echo "🛑 Stop services: docker-compose down"
else
    docker-compose -f $COMPOSE_FILE up --build
fi

echo ""
echo "🎉 AI Personal Assistant is running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the services"
