import { Schema } from "mongoose";
import mongoose from "mongoose";
const LikesSchema = new Schema({
    comments: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    video: {
        types: Schema.Types.ObjectId,
        ref: "Video"
    },
    tweets: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    }
}, {
    timestamps: true
}
)
export const Likes = mongoose.model("Likes", LikesSchema)