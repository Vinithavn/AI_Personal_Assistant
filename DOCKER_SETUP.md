# 🐳 Docker Setup Guide

This guide will help you run the AI Personal Assistant application using Docker.

## Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)

Check your installation:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Quick Start

### Option 1: Production Mode (Recommended)

Run the optimized production build:

```bash
cd AI_Personal_Assistant
docker-compose up --build
```

This will:
- Build both backend and frontend images
- Start the backend on http://localhost:8000
- Start the frontend on http://localhost:3000
- Set up networking between services
- Enable health checks

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

---

### Option 2: Development Mode

Run with hot-reload for development:

```bash
cd AI_Personal_Assistant
docker-compose -f docker-compose.dev.yml up
```

This mode:
- Mounts your local code as volumes
- Enables hot-reload for both services
- Faster iteration during development

---

## 📋 Common Commands

### Start services
```bash
docker-compose up
```

### Start in background (detached mode)
```bash
docker-compose up -d
```

### Rebuild and start
```bash
docker-compose up --build
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart a service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Check service status
```bash
docker-compose ps
```

---

## 🔧 Configuration

### Backend Environment Variables

Edit `app/services/.env`:
```env
GROKKEY=your-api-key-here
```

### Frontend Environment Variables

The frontend uses `NEXT_PUBLIC_API_URL` which is set in docker-compose.yml.

To change it, edit the `docker-compose.yml` file:
```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🐛 Troubleshooting

### Port already in use

If you get a port conflict error:

**For port 8000 (backend):**
```bash
# Find process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>
```

**For port 3000 (frontend):**
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

Or change the ports in `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Map to different host port
```

### Services won't start

1. Check Docker is running:
```bash
docker info
```

2. Check logs for errors:
```bash
docker-compose logs
```

3. Rebuild from scratch:
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Frontend can't connect to backend

Make sure both services are on the same network. Check with:
```bash
docker network ls
docker network inspect ai-assistant-network
```

### Permission issues

If you encounter permission errors:
```bash
sudo chown -R $USER:$USER .
```

---

## 🧹 Cleanup

### Remove all containers and images
```bash
docker-compose down --rmi all -v
```

### Remove unused Docker resources
```bash
docker system prune -a
```

---

## 📦 Production Deployment

For production deployment:

1. Update environment variables
2. Use production docker-compose:
```bash
docker-compose -f docker-compose.yml up -d
```

3. Set up reverse proxy (nginx/traefik)
4. Enable HTTPS
5. Set up monitoring and logging

---

## 🔍 Health Checks

Both services have health checks configured:

- Backend: Checks `/docs` endpoint
- Frontend: Checks root endpoint

View health status:
```bash
docker-compose ps
```

---

## 📝 Notes

- The backend uses hot-reload in development mode
- Frontend is optimized with standalone output for production
- Data persistence is handled via Docker volumes
- Services communicate via Docker network

---

## 🆘 Need Help?

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables are set correctly
3. Ensure ports 3000 and 8000 are available
4. Try rebuilding: `docker-compose up --build`

---

## 🎉 Success!

Once everything is running, you should see:
- ✅ Backend running on http://localhost:8000
- ✅ Frontend running on http://localhost:3000
- ✅ Both services healthy and communicating

Open http://localhost:3000 in your browser and start using your AI Personal Assistant!
