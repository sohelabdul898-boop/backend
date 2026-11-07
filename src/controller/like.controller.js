import { apierror } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiresponse.js";
import asynHandler from "../utils/asynchandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Likes } from "../models/likes.model.js"
import {Video} from "../models/video.model.js"

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
            .json(new apiResponse(200, { isLiked: false }, "like is removed form video"))
    }

    await Likes.create({ videoId, likedBy: req.user._id })
    return res
        .status(200)
        .json(new apiResponse(200, { isLiked: true }, "like is added on video"))
})


const toggleCommentLiked = asynHandler(async (req, res) => {
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new apierror(400, "comment id is not valid")
    }
    const ExistinglikeonComment = await Likes.findOne({
        comment: commentId,
        likeBy: req.user?._id
    })
    if (ExistinglikeonComment) {
        await Likes.findByIdAndDelete(ExistinglikeonComment._id)
        return res
            .status(200)
            .json(new apiResponse(200, { isLikedcomment: false }, " like is removed form comment"))
    }
    await Likes.create({ comment: commentId, likeBy: req.user?._id })
    return res
        .status(200)
        .json(new apiResponse(200, { isLikedcomment: true }, " liked is add on comment "))
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
            .json(new apiResponse(200, { isLiked: false }, "liked is removed from tweet"))
    }
    await Likes.create({ tweet: tweetId, likeBy: req.user?._id })
    return res
        .status(200)
        .json(new apiResponse(200, { isLiked: true }, "liked is add on tweet"))
})
const GetlikedVideos = asynHandler(async(req,res)=>{
    

const likedvideo = await Likes.aggregate([
    {
        $match:{
            likeBy:new mongoose.Types.ObjectId(req.user?._id),
            video:{
                $exists:true,
                $ne:null
            }
        }
    },{
        $lookup:{
            from:"Videos",
            localField:"video",
            foreignField:"_id",
            as:"videodetails"
        }
    },{
        $unwind:"$videodetails"
    },
    {
        $project:{
            _id:0,
            likedAt:"$createdAt",
            video:{
                _id:"$videodetails._id",
                title:"$videodetails.title",
                thumbnail:"$videodetails.thumbnail",
                duration:"$videodetails.duration",
                views:"$videodetails.views"

            }
        }
    }
])

return res
.status(200)
.json(new apiResponse(200,likedvideo,"liked video is fetched successfully"))
})
export {
    ToggleVideoLike,
    toggleCommentLiked,
    toggleTweetliked,
    GetlikedVideos
}