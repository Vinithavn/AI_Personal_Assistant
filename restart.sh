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

# Stop services
echo "🛑 Stopping services..."
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true

echo ""
echo "🔨 Rebuilding and starting services..."
echo ""

# Rebuild and start
docker-compose -f docker-compose.simple.yml up --build -d

echo ""
echo "✅ Services restarted!"
echo ""
echo "📊 View logs: docker-compose -f docker-compose.simple.yml logs -f"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
