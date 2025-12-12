import { makePrompt } from "../utils/prompts.js";
import { parseHFResponse } from "../utils/formatOutput.utils.js";
import { InferenceClient } from "@huggingface/inference";

// Server-side controller: accepts a topic string and returns points + diagram
const aiModelCall = async (topic) => {
    if (!topic || typeof topic !== "string") {
        throw new Error("Please provide a topic string");
    }

    const token = process.env.HF_API_KEY;
    if (!token) {
        throw new Error("HF_API_KEY is not set in environment");
    }

    const client = new InferenceClient(token);
    const prompt = makePrompt(topic);

    let response;
    const model = process.env.HF_MODEL || "deepseek-ai/DeepSeek-R1-0528:fastest";
    try {
        response = await client.chatCompletion(
            {
                model,
                messages: [
                    { role: "user", content: prompt },
                ],
                max_tokens: 800,
            },
            { provider: "auto" }
        );
    } catch (e) {
        // Fallback to a known working default
        response = await client.chatCompletion(
            {
                model: "deepseek-ai/DeepSeek-R1-0528:fastest",
                messages: [
                    { role: "user", content: prompt },
                ],
                max_tokens: 800,
            },
            { provider: "auto" }
        );
    }

    const content = response.choices?.[0]?.message?.content || response;
    const { points, diagram, reasoning } = parseHFResponse(content);
    return { points, diagram, reasoning };
};

export { aiModelCall };
// Express route handler for POST /generate
// Expects body { topic: string }
export const generate = async (req, res) => {
    try {
        const topic = req.body?.topic;
        const result = await aiModelCall(topic);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message || String(err) });
    }
};