#!/bin/bash

echo "🔧 Fixing corrupted database..."
echo ""

# Stop services and remove volumes
docker compose down -v

echo ""
echo "✅ Database removed. Restart the application with ./start.sh"
echo ""
echo "Note: You'll need to recreate users and sessions."
