# GraphGeneration - AI-Powered Learning Assistant

A full-stack application that generates educational content with interactive Mermaid diagrams and bullet points using AI. Features a ChatGPT-like conversational interface with multi-turn context awareness.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.x-blue)

## 🌟 Features

- **Conversational AI Interface** - ChatGPT-style multi-turn conversations with context awareness
- **Smart Diagram Generation** - Automatically creates Mermaid diagrams for any topic
- **Educational Content** - Generates 6 beginner-friendly bullet points per topic
- **User Authentication** - Secure JWT-based authentication with refresh tokens
- **Conversation Management** - Save, view, and manage chat histories
- **Guest Mode** - Try the app without signing up (results not saved)
- **Real-time Updates** - Optimistic UI updates with React Query
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Access + Refresh tokens)
- **AI Integration:** Ollama (local) or HuggingFace Inference API

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router v6
- **HTTP Client:** Axios

### AI/ML
- **Local LLM:** Ollama with customizable models
- **Cloud Alternative:** HuggingFace Inference API
- **Diagram Format:** Mermaid.js

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (running locally or MongoDB Atlas account)
- **Ollama** (for local AI) OR **HuggingFace API Key** (for cloud AI)
- **npm** or **yarn** package manager

### Installing Ollama (Local AI)

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com/download

# Pull a model (e.g., llama2, mistral)
ollama pull llama2
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/GraphGeneration.git
cd GraphGeneration
```

### 2. Backend Setup

```bash
cd aiMicroService

# Install dependencies
npm install

# Create environment file
cp ai.env.example ai.env
```

**Configure `ai.env`:**

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/graphgeneration
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/graphgeneration

# JWT Secrets (change these!)
ACCESS_TOKEN_SECRET=your-access-token-secret-here
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# AI Configuration - Choose ONE:

# Option 1: Ollama (Local)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2

# Option 2: HuggingFace (Cloud)
# HF_API_KEY=your-huggingface-api-key
# HF_MODEL=meta-llama/Llama-2-7b-chat-hf
```

### 3. Frontend Setup

```bash
cd ../Frontend

# Install dependencies
npm install
```

**Configure Vite proxy** (already set in `vite.config.ts`):
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

## ▶️ Running the Application

### Start Backend

```bash
cd aiMicroService
npm run dev
```

Backend runs at: `http://localhost:8000`

### Start Frontend

```bash
cd Frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Start Ollama (if using local AI)

```bash
ollama serve
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/users/` | Register new user | No |
| POST | `/api/v1/users/login` | Login user | No |
| POST | `/api/v1/users/logout` | Logout user | Yes |
| GET | `/api/v1/users/profile` | Get current user | Yes |
| POST | `/api/v1/users/refresh-token` | Refresh access token | Yes |
| PATCH | `/api/v1/users/update-profile` | Update user profile | Yes |
| POST | `/api/v1/users/change-password` | Change password | Yes |

### Conversation Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/conversations` | Create new conversation | Yes |
| GET | `/api/v1/conversations` | Get all conversations | Yes |
| GET | `/api/v1/conversations/:id` | Get conversation by ID | Yes |
| PATCH | `/api/v1/conversations/:id` | Update conversation title | Yes |
| DELETE | `/api/v1/conversations/:id` | Delete conversation | Yes |
| POST | `/api/v1/conversations/:id/messages` | Add message to conversation | Yes |

### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/ai/generates` | Generate content (guest mode) | No |

### Example Request

**Create conversation and add message:**

```bash
# 1. Create conversation
curl -X POST http://localhost:8000/api/v1/conversations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Learning React"}'

# 2. Add message (generates AI response)
curl -X POST http://localhost:8000/api/v1/conversations/CONVERSATION_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic": "React hooks"}'
```

## 📁 Project Structure

```
GraphGeneration/
├── aiMicroService/              # Backend API
│   ├── ai/                      # AI service logic
│   │   ├── ai.controller.js     # HuggingFace AI controller
│   │   └── ollama.service.js    # Ollama service
│   ├── controllers/             # Route controllers
│   │   ├── conversation.controller.js
│   │   ├── query.controller.js
│   │   └── user.controller.js
│   ├── models/                  # Mongoose models
│   │   ├── conversation.model.js
│   │   ├── query.model.js
│   │   └── user.model.js
│   ├── routes/                  # API routes
│   ├── middlewares/             # Custom middleware
│   ├── utils/                   # Utility functions
│   ├── db/                      # Database config
│   └── ai.env                   # Environment variables
│
└── Frontend/                    # React frontend
    ├── src/
    │   ├── components/          # React components
    │   │   ├── auth/            # Auth components
    │   │   ├── common/          # Reusable components
    │   │   ├── result/          # Result display
    │   │   ├── search/          # Search bar
    │   │   └── sidebar/         # Conversation sidebar
    │   ├── hooks/               # Custom hooks
    │   │   ├── conversation.hook.ts
    │   │   ├── query.hook.tsx
    │   │   └── users.hook.tsx
    │   ├── pages/               # Page components
    │   ├── context/             # React context
    │   ├── types/               # TypeScript types
    │   └── utils/               # Utility functions
    └── vite.config.ts           # Vite configuration
```

## 🔧 Configuration Options

### AI Model Selection

**Ollama Models (Local):**
- `llama2` - Good balance of speed and quality
- `mistral` - Faster, good for quick responses
- `codellama` - Better for technical content
- `llama2:13b` - Higher quality, slower

**HuggingFace Models (Cloud):**
- `meta-llama/Llama-2-7b-chat-hf`
- `mistralai/Mistral-7B-Instruct-v0.1`
- `HuggingFaceH4/zephyr-7b-beta`

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend port | 8000 | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | - | Yes |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | - | Yes |
| `OLLAMA_HOST` | Ollama server URL | http://localhost:11434 | If using Ollama |
| `OLLAMA_MODEL` | Ollama model name | llama2 | If using Ollama |
| `HF_API_KEY` | HuggingFace API key | - | If using HF |
| `HF_MODEL` | HuggingFace model | - | If using HF |

## 🧪 Testing

### Backend Testing

```bash
cd aiMicroService
npm test
```

### Frontend Testing

```bash
cd Frontend
npm test
```

## 🐛 Troubleshooting

### Ollama Connection Issues

```bash
# Check if Ollama is running
ollama list

# Restart Ollama
ollama serve

# Test model
ollama run llama2 "Hello"
```

### MongoDB Connection Issues

```bash
# Check MongoDB status
mongod --version

# Start MongoDB (if installed locally)
mongosh
```

### Port Already in Use

```bash
# Kill process on port 8000
npx kill-port 8000

# Kill process on port 5173
npx kill-port 5173
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **My Profile** - [GitHub Profile](https://github.com/Pen-Gun)

## 🙏 Acknowledgments

- [Ollama](https://ollama.com/) - Local LLM runtime
- [HuggingFace](https://huggingface.co/) - AI model hosting
- [Mermaid.js](https://mermaid.js.org/) - Diagram generation
- [TailwindCSS](https://tailwindcss.com/) - Styling framework

## 📧 Support

For support, email namshang715@gmail.com or open an issue in the GitHub repository.

---

**Built with ❤️ using React, Node.js, and AI**
 
## 📄 Documentation

- Weekly Log (10 Weeks): See [WEEKLY_LOG.md](WEEKLY_LOG.md) for a concise week-by-week activity summary.
