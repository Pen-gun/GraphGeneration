import apiError from "../utils/ApiError.js";
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/ApiResponse.js';
import { Query } from "../models/query.model.js";
import { Conversation } from "../models/conversation.model.js";
import { ollamaModelCall } from "../ai/ollama.service.js";

const createQuery = asyncHandler(async (req, res) => {
    const userid = req.user._id;
    const { topic, points, diagram } = req.body;
    if (!userid) {
        throw new apiError(401, "unauthorized user!");
    }
    if (!topic || !points || !Array.isArray(points) || points.length === 0) {
        throw new apiError(400, "topic and points are required to create a query!");
    }
    const query = await Query.create({ owner: userid, topic, points, diagram });
    return res.status(201).json(
        new apiResponse(201, query, "query created successfully!")
    );
});
const getUserQueries = asyncHandler(async (req, res) => {
    const userid = req.user._id;
    if (!userid) {
        throw new apiError(401, "unauthorized user!");
    }
    const queries = await Query.find({ owner: userid }).sort({ createdAt: -1 });
    return res.status(200).json(
        new apiResponse(200, queries, "user queries fetched successfully!")
    );
});
const deleteQuery = asyncHandler(async (req, res) => {
    const userid = req.user._id;
    const queryid = req.params.id;
    if (!userid) {
        throw new apiError(401, "unauthorized user!");
    }
    const query = await Query.findById(queryid);
    if (!query) {
        throw new apiError(404, "query not found!");
    }
    if (userid.toString() !== query.owner.toString()) {
        throw new apiError(403, "forbidden! you are not allowed to delete this query.");
    }
    if (query.conversationId) {
        await Conversation.findByIdAndUpdate(
            query.conversationId,
            {
                $pull: { messages: query._id },
                $set: { lastMessage: new Date() }
            }
        );
    }
    await Query.findByIdAndDelete(queryid);
    return res.status(200).json(
        new apiResponse(200, null, "query deleted successfully!")
    );
});

const countQueries = asyncHandler(async (req, res) => {
    const totalQueries = await Query.countDocuments({
        owner: req.user._id
    });
    return res.status(200).json(
        new apiResponse(200, { totalQueries }, "total queries counted successfully!")
    );
});

const addQueryToConversation = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const conversationId = req.params.id;
    const { topic, points, diagram, role = 'user' } = req.body;

    if (!userId) {
        throw new apiError(401, "unauthorized user!");
    }
    if (!conversationId) {
        throw new apiError(400, "conversationId is required in the route parameter");
    }
    if (!topic) {
        throw new apiError(400, "topic is required");
    }

    // Fetch conversation with all previous messages
    const conversation = await Conversation.findOne({ _id: conversationId, owner: userId })
        .populate({
            path: 'messages',
            options: { sort: { createdAt: 1 } }
        });

    if (!conversation) {
        throw new apiError(404, "conversation not found or access denied");
    }

    // Build conversation history BEFORE adding new message
    const conversationHistory = conversation.messages
        .filter(msg => msg.role) // Only include messages with role
        .map(msg => ({
            role: msg.role,
            content: msg.topic || msg.points?.join('\n') || ''
        }));

    // Generate AI response using conversation history
    let aiPoints = [];
    let aiDiagram = '';
    let aiReasoning = '';

    try {
        // Call AI model with conversation history (excludes current message)
        const aiResult = await ollamaModelCall(topic, conversationHistory);
        aiPoints = aiResult.points || [];
        aiDiagram = aiResult.diagram || '';
        aiReasoning = aiResult.reasoning || '';
    } catch (aiError) {
        console.error('AI generation error:', aiError);
        // Continue without AI response rather than failing the whole request
        aiPoints = ['AI service unavailable'];
        aiDiagram = '';
        aiReasoning = aiError.message;
    }

    // Save user's query
    const userMessage = await Query.create({
        conversationId,
        owner: userId,
        topic,
        points: points || [],
        diagram: diagram || '',
        role: 'user',
    });

    // Save AI's response as assistant message
    const assistantMessage = await Query.create({
        conversationId,
        owner: userId,
        topic,
        points: Array.isArray(aiPoints) ? aiPoints : 
               (typeof aiPoints === 'string' ? aiPoints.split('\n').filter(p => p.trim()) : [aiPoints]),
        diagram: aiDiagram,
        role: 'assistant',
    });

    // Update conversation only after both messages are successfully created
    conversation.messages.push(userMessage._id, assistantMessage._id);
    conversation.lastMessage = new Date();
    await conversation.save();

    return res.status(201).json(
        new apiResponse(201, {
            userMessage,
            assistantMessage
        }, "query processed and response generated successfully!")
    );
});

export { createQuery, getUserQueries, deleteQuery, countQueries, addQueryToConversation };