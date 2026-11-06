import { apierror } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiresponse.js";
import asynHandler from "../utils/asynchandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Likes } from "../models/likes.model.js"

const ToggleVideoLike = asynHandler(async (req, res) => {
    const { videoId } = req.params


    if (!isValidObjectId(videoId)) {
        throw new apierror(401, "video Id is not valid")
    }


    const existinglike = await Likes.findOne({
        video: videoId,
        likeBy: req.user?._id,
    })


    if (existinglike) {
        await Likes.findByIdAndDelete(existinglike._id)
        return res
            .status(200)
            .json(new apiResponse(200, { isLiked: false }, "liked is removed"))
    }

    await Likes.create({ videoId, likedBy: req.user._id })
    return res
        .status(200)
        .json(new apiResponse(200, { isLiked: true }, "liked is added"))
})


const toggleCommentLiked = asynHandler(async (req, res) => {
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new apierror(400, "comment ID is not valid")
    }
    const ExistinglikeonComment = await Likes.findOne({
        comment: commentId,
        likeBy: req.user?._id
    })
    if (ExistinglikeonComment) {
        await Likes.findByIdAndDelete(ExistinglikeonComment._id)
        return res
            .status(200)
            .json(new apiResponse(200, { isLikedcomment: false }, "Is liked removed"))
    }
    await Likes.create({ comment: commentId, likeBy: req.user?._id })
    return res
        .status(200)
        .json(new apiResponse(200, { isLikedcomment: true }, "is liked is add"))
})


const toggleTweetliked = asynHandler(async (req, res) => {
    const { tweetId } = req.params
    
    if (!isValidObjectId(tweetId)) {
        throw new apierror(400, "id is not valid")
    }
    const Existinglikedontweet = await Likes.findOne({
        tweet: tweetId,
        likeBy: req.user?._id
    })
    if (Existinglikedontweet) {
        await Likes.findByIdAndDelete(Existinglikedontweet._id)
        return res
            .status(200)
            .json(new apiResponse(200, { isLiked: false }, "is liked is removed"))
    }
    await Likes.create({ tweet: tweetId, likeBy: req.user?._id })
    return res
        .status(200)
        .json(new apiResponse(200, { isLiked: true }, "is liked is add"))
})
const GetlikedVideos = asynHandler(async(req,res)=>{

})
export {
    ToggleVideoLike,
    toggleCommentLiked,
    toggleTweetliked,
    GetlikedVideos
}