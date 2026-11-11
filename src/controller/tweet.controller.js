import { isValidObjectId } from "mongoose";
import mongoose from "mongoose";
import { apierror } from "../utils/ApiError.js"
import { apiresponse } from "../utils/apiresponse.js"
import asyncHandler from "../utils/asynchandler.js"
import { Tweet } from "../models/tweets.model.js";
import { User } from "../models/user.model.js"
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    if (!content || content.trim() == "") {
        throw new apierror(404, "content is required")
    }
    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user?._id
    })
    return res
        .status(200)
        .json(new apiresponse(200, tweet, "Your tweet is successfully created"))
})
const getUsertweet = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new apierror(400, "user id is not valid")
    }
    const user = await User.findById(userId)
    if (!user) {
        throw new apierror(400, "user is not exist")
    }
    const tweets = await Tweet.find({
        owner: userId
    }).sort({
        createdAt: -1
    });
    return res
        .status(200)
        .json(200, tweets, "user tweet fetched successfully")

})
const updatetweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body
    if (!isValidObjectId(tweetId)) {
        throw new apierror(400, "tweet id is not valid")
    }
    if (!content || content.trim() == "") {
        throw new apierror(400, "content is required")
    }
    const usertweet = await Tweet.findById(tweetId)
    if (!usertweet) {
        throw new apierror(400, "user tweet not found")
    }
    if (usertweet.owner.toString() !== req.user?._id.toString()) {
        throw new apierror(400, "you can only edit your tweet")
    }
    const tweet = await Tweet.findByIdAndUpdate(tweetId, {
        $set: {
            content: content.trim()
        }
    }, {
        new: true
    })
    return res
        .status(200)
        .json(new apiresponse(200, tweet, "your tweet update successfully"))
})
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId)) {
        throw new apierror(400, "tweet id is not valid")
    }
    const userTweet = await Tweet.findById(tweetId)
    if (!userTweet) {
        throw new apierror(400, "user tweet is not exist")
    }
    if (userTweet.owner.toString() !== req.user?._id.toString()) {
        throw new apierror(400, "you can only delete your tweet")
    }
    const tweet = await Tweet.findByIdAndDelete(tweetId)
    return res.status(200).json(new apiresponse(200, tweet, "your tweet deleted succssfully"))
})

export {
    createTweet,
    updatetweet,
    deleteTweet,
    getUsertweet
}
