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
        maxlength: 100,
        trim: true,
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

// Index for efficient conversation list queries
conversationSchema.index({ owner: 1, lastMessage: -1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);