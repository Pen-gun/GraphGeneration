import { Ollama } from 'ollama';
import { makePrompt } from "../utils/prompts.js";
import { parseHFResponse } from "../utils/formatOutput.utils.js";

const ollama = new Ollama({ host: process.env.OLLAMA_HOST });

// Pure function: call local Ollama and return normalized output
// Accepts optional conversation history for multi-turn context
export const ollamaModelCall = async (topic, conversationHistory = []) => {
    if (!topic || typeof topic !== "string") {
        throw new Error("Please provide a topic string");
    }
    const prompt = makePrompt(topic);
    
    // Build messages array: include conversation history + current prompt
    const messages = [
        ...conversationHistory.map(msg => ({
            role: msg.role || 'user',
            content: msg.content || msg.topic || ''
        })),
        { role: 'user', content: prompt }
    ];
    
    try {
        const response = await ollama.chat({
            model: process.env.OLLAMA_MODEL,
            messages: messages,
            // Ask for strict JSON; many community models adhere enough for parsing
            format: 'json',
            options: { temperature: 0.7, top_p: 0.9 },
        });

        const content = response?.message?.content ?? '';
        // If content is JSON, parse directly; else use tolerant parser
        let parsed;
        try {
            parsed = typeof content === 'string' ? JSON.parse(content) : content;
        } catch {
            parsed = parseHFResponse(content);
        }

        // Normalize output
        const points = parsed.points ?? [];
        const diagram = parsed.diagram ?? '';
        const reasoning = parsed.reasoning ?? '';
        return { points, diagram, reasoning };
    } catch (error) {
        console.error('Ollama generation error:', error);
        throw error;
    }
};

// Optional Express handler if you want a dedicated route
export const generateGraphData = async (req, res) => {
    try {
        const topic = req.body?.topic;
        const result = await ollamaModelCall(topic);
        return res.json(result);
    } catch (err) {
        return res.status(400).json({ error: err?.message || String(err) });
    }
};