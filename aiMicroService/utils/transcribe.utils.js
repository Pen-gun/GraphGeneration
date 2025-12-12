import { InferenceClient } from "@huggingface/inference";

async function transcribe(file) {
  const token = process.env.HF_API_KEY;
  if (!token) {
    throw new Error("HF_API_KEY is not set in environment");
  }

  const client = new InferenceClient(token);

  const output = await client.automaticSpeechRecognition({
    data: file,
    model: "openai/whisper-large-v3-turbo",
    provider: "auto",
  });

  return output.text || output || "Transcription completed";
}
export { transcribe };