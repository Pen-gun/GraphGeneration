import { InferenceClient } from "@huggingface/inference";
import { makePrompt } from "./prompts.js";

async function summarize(transcript) {
  const token = process.env.HF_API_KEY;
  if (!token) {
    throw new Error("HF_API_KEY is not set in environment");
  }
  const client = new InferenceClient(token);

  const prompt = makePrompt(transcript);

  const response = await client.chatCompletion(
    {
      model: "deepseek-ai/DeepSeek-R1-0528:fastest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
    },
    {
      provider: "auto",
    }
  );

  return (
    response.choices?.[0]?.message?.content ||
    response ||
    "No summary available"
  );
}

export { summarize };