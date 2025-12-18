# AI Engine (simple)

1. Copy .env.example -> .env and set HF_API_KEY and HF_MODEL
2. npm install
3. npm start
4. POST /generate { "topic": "Machine Learning" }

for testing you can send
graph TD; A[Data]-->B[Model]; B-->C[Prediction]; A-->D[Features]; D-->B;

ollama serve
ollama run llama3.2:3b
taskkill /IM  Ollama.exe /F

how to use ollama going forward
POST http://localhost:11434/api/generate
POST http://localhost:11434/api/chat


ai.env in aimicroservice root
HF_API_KEY=
HF_MODEL=deepseek-ai/DeepSeek-R1-0528:fastest #any model you want
# "gpt-oss-20b"
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URL=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

OLLAMA_HOST=
OLLAMA_MODEL=