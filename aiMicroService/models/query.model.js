import mongoose, {Schema} from "mongoose";

const querySchema = new Schema({
    
    conversationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    topic: {
        type: String,
    },
    points: {
        type: [String],
        required: true,
    },
    diagram: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        default: 'user',
    }
},{timestamps: true});

export const Query = mongoose.model('Query', querySchema);