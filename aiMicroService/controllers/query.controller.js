import apiError from "../utils/ApiError.js";
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/ApiResponse.js';
import { Query } from "../models/query.model.js";

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
    if(userid.toString() !== query.owner.toString()){
        throw new apiError(403, "forbidden! you are not allowed to delete this query.");
    }
    await Query.findByIdAndDelete(queryid);
    return res.status(200).json(
        new apiResponse(200, null, "query deleted successfully!")
    );
});

export { createQuery, getUserQueries, deleteQuery };