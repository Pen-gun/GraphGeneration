import mongoose, {Schema} from "mongoose";

const querySchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    points: {
        type: [String],
        required: true,
    },
    diagram: {
        type: String,
    },
},{timestamps: true});

export const Query = mongoose.model('Query', querySchema);