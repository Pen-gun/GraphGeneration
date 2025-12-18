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

// Indexes for performance
querySchema.index({ conversationId: 1, createdAt: 1 });
querySchema.index({ owner: 1 });

export const Query = mongoose.model('Query', querySchema);