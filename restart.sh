#!/bin/bash

# AI Personal Assistant - Quick Restart Script

set -e

echo "🔄 Restarting AI Personal Assistant..."
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

# Stop services
echo "🛑 Stopping services..."
$DOCKER_COMPOSE down 2>/dev/null || true

echo ""
echo "🔨 Rebuilding and starting services..."
echo ""

# Rebuild and start
$DOCKER_COMPOSE up --build -d

echo ""
echo "✅ Services restarted!"
echo ""
echo "📊 View logs: $DOCKER_COMPOSE logs -f"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
