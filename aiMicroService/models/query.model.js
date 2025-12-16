import mongoose, {Schema} from "mongoose";

const querySchema = new Schema({
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