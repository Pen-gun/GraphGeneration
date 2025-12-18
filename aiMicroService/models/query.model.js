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
        required: function () { return this.role === 'assistant'; },
        default: [],
    },
    diagram: {
        type: String,
        required: function () { return this.role === 'assistant'; },
        default: '',
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        default: 'user',
    }
},{timestamps: true});

export const Query = mongoose.model('Query', querySchema);