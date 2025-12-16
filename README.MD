for testing you can send
graph TD; A[Data]-->B[Model]; B-->C[Prediction]; A-->D[Features]; D-->B;

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