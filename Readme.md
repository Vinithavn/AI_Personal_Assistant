# 🤖 AI Personal Assistant

A smart conversational AI that remembers your preferences, detects contradictions, and maintains context across conversations. Built with FastAPI, Next.js, and ChromaDB for intelligent memory management.

## Features

- **Intelligent Memory**: Automatically extracts and stores facts from conversations
- **Conflict Detection**: Alerts when new messages contradict previous preferences
- **Semantic Search**: Finds relevant past conversations using vector embeddings
- **Multi-Session Support**: Organize conversations with auto-generated session names
- **User Authentication**: Secure signup/login system
- **Responsive UI**: Clean, modern interface built with Next.js and Tailwind CSS
- **Docker Ready**: One-command deployment with hot-reload for development

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

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd AI_Personal_Assistant
```

### 2. Environment Setup

- Create the .env inside app/services
- Set up the API Key (Here Grok API key is used from Openrouter)


### 3. Start Application

```bash
# Start in background
./start.sh 
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs


## Application flow

1. **Sign Up**: Create a new account at http://localhost:3000/signup
2. **Login**: Access your account at http://localhost:3000/login
3. **Create/select session**: Create a new session or select an existing session
4. **Start Chatting**: Begin a conversation with your AI assistant


## Example
![Alt text](https://github.com/Vinithavn/AI_Personal_Assistant/blob/main/images/Screenshot%202025-12-12%20at%201.03.54%E2%80%AFPM.png)
