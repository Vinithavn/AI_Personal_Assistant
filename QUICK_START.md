# 🚀 Quick Start Guide

## ✅ Your Application is Ready!

The logs you saw were **successful** - the backend started and created the database tables. You just stopped it with Ctrl+C.

---

## 🎯 Start the Application

Simply run:

```bash
./start.sh
```

**That's it!** Wait 1-2 minutes for the build to complete.

---

## 🌐 Access Your App

Once you see "✅ Services started", open:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📊 Monitor the Application

### View logs in real-time:
```bash
docker-compose -f docker-compose.simple.yml logs -f
```

### Check if services are running:
```bash
docker-compose -f docker-compose.simple.yml ps
```

### View only backend logs:
```bash
docker-compose -f docker-compose.simple.yml logs -f backend
```

### View only frontend logs:
```bash
docker-compose -f docker-compose.simple.yml logs -f frontend
```

---

## 🛑 Stop the Application

```bash
./stop.sh
```

Or manually:
```bash
docker-compose -f docker-compose.simple.yml down
```

---

## 🔄 Restart After Code Changes

If you make changes to the code:

```bash
./stop.sh
./start.sh
```

---

## 🐛 Troubleshooting

### Frontend not loading?

Wait a bit longer - the frontend build takes 1-2 minutes. Check logs:
```bash
docker-compose -f docker-compose.simple.yml logs frontend
```

### Port already in use?

Kill the process using the port:
```bash
# For port 8000
lsof -ti:8000 | xargs kill -9

# For port 3000
lsof -ti:3000 | xargs kill -9
```

### Want to rebuild from scratch?

```bash
./stop.sh -v
docker-compose -f docker-compose.simple.yml build --no-cache
./start.sh
```

---

## ✨ What You Just Saw

The logs showing:
```
CREATE TABLE userfact ...
```

This means your backend **successfully started** and created the database! 🎉

The "Gracefully Stopping" message appeared because you pressed Ctrl+C to stop it.

---

## 🎮 Next Steps

1. Run `./start.sh`
2. Wait for build to complete (1-2 minutes)
3. Open http://localhost:3000
4. Sign up for an account
5. Start chatting with your AI assistant!

---

**Need help?** Check the full documentation in `DOCKER_SETUP.md`
