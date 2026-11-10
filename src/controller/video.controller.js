import  asynHandler  from "../utils/asynchandler.js";
import { apierror } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiresponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js"
// import {uploadOnCloudinary} from "../utils/Cloudnary.js"
import { uploadonCloudinary } from "../utils/Cloudnary.js"
import mongoose, { isValidObjectId } from "mongoose";
const getallvideos = asynHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, useId } = req.query
    const pageNum =parseInt(page)
    const limitNum = parseInt(limit)
const matchstage = { published:true }
if(query){
matchstage.title = {$regex:query,$option:"i"}
}
if(useId){
    if (!isValidObjectId(useId)) {
        throw new apierror(400,"user id is not valid")
    }
    matchstage.owner = new mongoose.Types.ObjectId(useId)
}
const video = await Video.aggregate([
    {$match:matchstage},
    {$sort:{[sortBy]:sortType ==="asc"?1:-1}},
    {$skip:(pageNum-1)*limitNum},
    {$limit:limitNum},
    {
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"owner",
            pipeline:[{$project:{
                username:1,
                avtar:1
            }}]

        }
    },{
        $unwind:"$owner"
    }

])
const totalVideoCount = await Video.countDocuments(matchstage)
return res
.status(200)
.json(new apiResponse(200,{video,totalVideoCount,page:pageNum,totalPages:Math.ceil(totalVideoCount/limitNum)}))
})



const publishedVideo = asynHandler(async (req, res) => {
    const { title, description } = req.body
    const videofilelocalpath = req.files?.videofile[0]?.path
    const thumbnalifilelocalpath = req.files?.thumbnail[0]?.path
    if (!title || !description) {
        throw new apierror(400, "title and description is required")
    }
    const uploadvideo = await uploadonCloudinary(videofilelocalpath)
    const uploadthumbnail = await uploadonCloudinary(thumbnalifilelocalpath)
    if (!uploadvideo.url) {
        throw new apierror(401, "video url is not found")
    }
    if (!uploadthumbnail.url) {
        throw new apierror(401, "thumbnail url is not found")
    }
    const video = await Video.create({
        title: title,
        description: description,
        videoFile: uploadvideo.url,
        thumbnail: uploadthumbnail.url,
        duration: uploadvideo.duration,
        owner: req.user?._id
    })
    return res
        .status(200)
        .json(new apiResponse(200, video, "your video is successfully published"))
})
const getVideoById = asynHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new apierror(401, "Id is not valid")
    }
    const video = await Video.findById(videoId).populate("owner", "username avtar")
    if (!video) {
        throw new apierror(401, "video is missing")
    }
    return res
        .status(200)
        .json(new apiResponse(200, video, "video fetched successfully"))
})
const updateVideo = asynHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnaillocalpath = req.file?.path
    if (!isValidObjectId(videoId)) {
        throw new apierror(400, "video id is not valid")
    }
    const existingVideo = await Video.findById(videoId)
    if (!existingVideo) {
        throw new apierror(400, "video was not exist")
    }
    if (existingVideo.owner.toString() !== req.user?._id.toString()) {
        throw new apierror(400, "you can update only your video")
    }
    const updateData = {}
    if (title) updateData.title = title
    if (description) updateData.description = description

    if (thumbnaillocalpath) {
        const thumbnail = await uploadonCloudinary(thumbnaillocalpath)
        if (!thumbnail?.url) {
            throw new apierror(400, "some error occur while uploading")
        }
        updateData.thumbnail = thumbnail.url
    }
    const updatedvideo = await Video.findByIdAndUpdate(videoId, {
        $set: updateData
    }, {
        new: true
    }
    )
    return res
        .status(200)
        .json(new apiResponse(200, updateVideo, "video update successfully"))
})
const deleteVideo = asynHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new apierror(401, "video id is not valid")
    }

    const UserVideo = await Video.findById(videoId)
    if (!UserVideo) {
        throw new apierror(401, " User video does not exist")
    }
    if (UserVideo.owner.toString !== req.user?._id.toString) {
        throw new apierror(401, "you can only delete your own video")
    }
    const video = await Video.findByIdAndDelete(videoId)
    return res.status(200).json(new apiResponse(200, {}, "Video was delete successfully"))
})
const toggleVideostatus = asynHandler(async (req, res) => {
    const { videoId } = req.params
    if (isValidObjectId(videoId)) {
        throw new apierror(401, "id is not valid")
    }
    const existingVideo = await Video.findById(videoId)
    if (!existingVideo) {
        throw new apierror(400, "video was not exist")
    }
    if (existingVideo.owner.toString() !== req.user?._id) {
        throw new apierror(400, "you can only update your video")
    }
    existingVideo.published = !existingVideo.published
    await existingVideo.save({ validateBeforeSave: false })
    return res.status(200).json(new apiResponse(200, { published: existingVideo.published }, existingVideo.published ? "video is published" : "video is unpublished")
    )
})
export {
    getallvideos,
    publishedVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    toggleVideostatus
}