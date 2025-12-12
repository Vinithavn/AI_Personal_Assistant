# 🤖 AI Personal Assistant

A smart conversational AI that remembers your preferences, detects contradictions, and maintains context across conversations. Built with FastAPI, Next.js, and ChromaDB for intelligent memory management.

## ✨ Features

- **🧠 Intelligent Memory**: Automatically extracts and stores facts from conversations
- **🔍 Conflict Detection**: Alerts when new messages contradict previous preferences
- **🔗 Semantic Search**: Finds relevant past conversations using vector embeddings
- **💬 Multi-Session Support**: Organize conversations with auto-generated session names
- **🔐 User Authentication**: Secure signup/login system
- **📱 Responsive UI**: Clean, modern interface built with Next.js and Tailwind CSS
- **🐳 Docker Ready**: One-command deployment with hot-reload for development

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   FastAPI       │    │   ChromaDB      │
│   Frontend       │◄──►│   Backend       │◄──►│   Vector Store  │
│   (Port 3000)   │    │   (Port 8000)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   SQLite        │
                       │   Database      │
                       └─────────────────┘
```

### Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- SQLModel - SQL database ORM with Pydantic integration
- ChromaDB - Vector database for semantic search
- Sentence Transformers - Text embeddings
- OpenAI/Groq API - LLM integration

**Frontend:**
- Next.js 15 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- React Context - State management

**Infrastructure:**
- Docker & Docker Compose - Containerization
- SQLite - Database (development)
- Volume mounts - Data persistence

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd AI_Personal_Assistant
```

### 2. Environment Setup

```bash
# Copy environment template
cp app/services/.env.example app/services/.env

# Edit with your API keys
nano app/services/.env
```

Required environment variables:
```env
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # Optional fallback
DATABASE_PATH=/app/data/mydb.sqlite
```

### 3. Start Application

```bash
# Start in background
./start.sh -d

# Or start with logs
./start.sh
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📖 Usage

### Getting Started

1. **Sign Up**: Create a new account at http://localhost:3000/signup
2. **Login**: Access your account at http://localhost:3000/login
3. **Start Chatting**: Begin a conversation with your AI assistant
4. **Explore Features**: Try the conflict detection and memory features

### Key Features Demo

**Memory System:**
```
You: "I love pizza"
AI: "Great! I'll remember that you love pizza."

You: "What do I like to eat?"
AI: "You mentioned that you love pizza!"
```

**Conflict Detection:**
```
You: "I love pizza"
AI: "Noted! You love pizza."

You: "I hate pizza"
AI: "Your new message seems to contradict your previous preferences. Do you want to override?"
[Yes] [No]
```

### API Endpoints

**Authentication:**
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

**Sessions:**
- `POST /session/` - Create new chat session
- `GET /session/{username}` - List user sessions
- `GET /session/get/{session_id}` - Get session data

**Chat:**
- `POST /chat/` - Send message (with conflict detection)
- `GET /chat/userfacts?username={username}` - View stored facts

## 🛠️ Development

### Project Structure

```
AI_Personal_Assistant/
├── app/                    # FastAPI backend
│   ├── main.py            # Application entry point
│   ├── routers/           # API endpoints
│   ├── services/          # Business logic
│   ├── models/            # Database models
│   ├── schemas/           # Pydantic models
│   ├── utils/             # Helper functions
│   └── prompts/           # LLM prompts
├── personal-ai/           # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities & API client
├── docker-compose.yml     # Development setup
├── Dockerfile            # Backend container
└── README.md
```

### Development Commands

```bash
# Start development environment
./start.sh

# View logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# Restart services
./restart.sh

# Stop services
./stop.sh

# Stop and remove data
./stop.sh -v
```

### Database Management

```bash
# View stored facts
curl "http://localhost:8000/chat/userfacts?username=yourname"

# Access database directly
docker exec -it ai-assistant-backend-dev sqlite3 /app/data/mydb.sqlite

# Reset corrupted database
docker compose down -v
./start.sh
```

### Adding New Features

1. **Backend**: Add routes in `app/routers/`
2. **Frontend**: Add pages in `personal-ai/src/app/`
3. **Database**: Update models in `app/models/database.py`
4. **API Client**: Update `personal-ai/src/lib/api.ts`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq API key for LLM | Yes |
| `OPENAI_API_KEY` | OpenAI API key (fallback) | No |
| `DATABASE_PATH` | SQLite database path | No |
| `NEXT_PUBLIC_API_URL` | Backend API URL | No |

### Docker Configuration

The application uses Docker Compose with:
- **Hot-reload**: Code changes reflect immediately
- **Volume persistence**: Data survives container restarts
- **Network isolation**: Services communicate securely
- **Development optimization**: Fast rebuilds and debugging

## 🚀 Deployment

### Production Checklist

- [ ] Use PostgreSQL instead of SQLite
- [ ] Set up reverse proxy (Nginx/Caddy)
- [ ] Enable HTTPS
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting
- [ ] Remove debug endpoints
- [ ] Use production WSGI server

### Production Docker Compose

```yaml
services:
  backend:
    command: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
    environment:
      - ENVIRONMENT=production
    restart: always
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for frontend development
- Add type hints to all functions
- Write descriptive commit messages
- Test your changes before submitting

## 📝 API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐛 Troubleshooting

### Common Issues

**Database Corruption:**
```bash
docker compose down -v
./start.sh
```

**Port Already in Use:**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Kill the process or change ports in docker-compose.yml
```

**API Key Issues:**
- Ensure `.env` file exists in `app/services/`
- Check API key format and validity
- Restart containers after changing environment variables

**Frontend Build Errors:**
```bash
# Clear Next.js cache
docker compose exec frontend rm -rf .next
docker compose restart frontend
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Amazing Python web framework
- [Next.js](https://nextjs.org/) - Powerful React framework
- [ChromaDB](https://www.trychroma.com/) - Vector database for AI
- [Sentence Transformers](https://www.sbert.net/) - Text embeddings

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [API Documentation](#-api-documentation)
3. Open an issue on GitHub
4. Check existing issues for solutions

---

**Built with ❤️ using FastAPI, Next.js, and ChromaDB**

⭐ Star this repo if you found it helpful!