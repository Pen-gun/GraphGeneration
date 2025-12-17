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
    const model = process.env.HF_MODEL;
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
                model: model,
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

export const generate = async (req, res) => {
    try {
        const topic = req.body?.topic;

        // Quick test/bypass: if the incoming topic looks like a Mermaid definition,
        // return it directly without calling the model. Also allow explicit 'diagram' override.
        const overrideDiagram = typeof req.body?.diagram === "string" ? req.body.diagram.trim() : null;
        const candidate = overrideDiagram ?? (typeof topic === "string" ? topic.trim() : "");
        if (candidate) {
            // Extract fenced mermaid if provided
            const fenceMatch = candidate.match(/```(?:mermaid)?\s*([\s\S]*?)```/i);
            const maybeDiagram = fenceMatch ? fenceMatch[1].trim() : candidate;
            if (/^\s*graph\s+/i.test(maybeDiagram)) {
                return res.json({
                    points: ["User-provided diagram test"],
                    diagram: maybeDiagram,
                    reasoning: "Bypass: using user-provided Mermaid diagram from request",
                });
            }
        }

        const result = await aiModelCall(topic);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message || String(err) });
    }
};