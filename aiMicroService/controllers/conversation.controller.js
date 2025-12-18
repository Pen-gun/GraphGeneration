import apiError from "../utils/ApiError.js";
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/ApiResponse.js';
import { Conversation } from "../models/conversation.model.js";
import { Query } from "../models/query.model.js";

const createConversation = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.create({
        owner: userId,
        title: title?.trim() || "New Conversation",
    });

    return res
        .status(201)
        .json(new apiResponse(201, conversation, "Conversation created"));
});

const getConversations = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const conversations = await Conversation.find({ owner: userId })
        .select("title lastMessage createdAt updatedAt")
        .sort({ lastMessage: -1 });
    
    return res
        .status(200)
        .json(new apiResponse(200, conversations, "Conversations fetched"));
});

const getConversationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
        _id: id,
        owner: userId,
    }).populate({
        path: "messages",
        options: { sort: { createdAt: 1 } },
    });

    if (!conversation) {
        throw new apiError(404, "Conversation not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, conversation, "Conversation fetched"));
});

const updateConversationTitle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user._id;

    if (!title?.trim()) {
        throw new apiError(400, "Title is required");
    }

    const conversation = await Conversation.findOneAndUpdate(
        { _id: id, owner: userId },
        { title: title.trim() },
        { new: true }
    );

    if (!conversation) {
        throw new apiError(404, "Conversation not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, conversation, "Title updated"));
});

const deleteConversation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
        _id: id,
        owner: userId,
    });

    if (!conversation) {
        throw new apiError(404, "Conversation not found");
    }

    // delete all messages
    await Query.deleteMany({ _id: { $in: conversation.messages } });

    await conversation.deleteOne();

    return res
        .status(200)
        .json(new apiResponse(200, null, "Conversation deleted"));
});



export { createConversation, getConversations, getConversationById, updateConversationTitle, deleteConversation };