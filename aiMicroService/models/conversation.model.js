import mongoose, {Schema} from "mongoose";

const conversationSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        default: 'New Conversation',
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Query',
        required: true,
    }],
    lastMessage: {
        type: Date,
        default: Date.now,
    }
},{timestamps: true});