import {asynHandler} from "../utils/asynchandler.js";
import { apierror } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiresponse.js";
import { Video } from "../models/video.model.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudnary.js"
import mongoose,{isValidObjectId} from "mongoose";
const getallvideos = asynHandler(async(req,res)=>{
const {page =1,limit =10,query,sortBy,sortType,useId}= req.query
})



const publishedVideo = asynHandler(async(req,res)=>{
const {title,description} = req.body
const videofilelocalpath = req.files?.videofile[0]?.path
const thumbnalifilelocalpath = req.files?.thumbnail[0]?.path
if (!title || !description) {
    throw new apierror(400,"title and description is required")
}
const uploadvideo = await uploadOnCloudinary(videofilelocalpath)
const uploadthumbnail = await uploadOnCloudinary(thumbnalifilelocalpath)
if(!uploadvideo.url){
    throw new apierror(401,"video url is not found")
}
if (!uploadthumbnail.url) {
    throw new apierror(401,"thumbnail url is not found")
}
const video = await Video.create({
    title:title,
    description:description,
    videoFile:uploadvideo.url,
    thumbnail:uploadthumbnail.url,
    duration:uploadvideo.duration,
    owner:req.user?._id
})
return res
.status(200)
.json(new apiResponse(200,video,"your video is successfully published"))
})
const getVideoById = asynHandler(async(req,res)=>{
const {videoId} =req.params
if(!isValidObjectId(videoId)){
    throw new apierror(401,"Id is not valid")
}
const video = await Video.findById(videoId).populate("owner","username avtar")
if (!video) {
    throw new apierror(401,"video is missing")
}
 return res
 .status(200)
 .json(new apiResponse(200,video,"video fetched successfully")) 
})
const updateVido = asynHandler(async(req,res)=>{
const {videoId} = req.params
})
const deleteVideo = asynHandler(async(req,res)=>{
const {videoId} = req.params
if (!isValidObjectId(videoId)) {
    throw new apierror(401,"video id is not valid")
}

const UserVideo = await Video.findById(videoId)
if (!UserVideo) {
    throw new apierror(401," User video does not exist")
}
if (UserVideo.owner.toString !==req.user?._id.toString) {
    throw new apierror(401,"you can only delete your own video")
}
const video = await Video.findByIdAndDelete(videoId)
 return res.status(200).json(new apiResponse(200,{},"Video was delete successfully"))
})








const toggleVideostatus = asynHandler(async(req,res)=>{
const {videoId} = req.params

})
export{
    getallvideos,
    publishedVideo,
    getVideoById,
    updateVido,
    deleteVideo,
    toggleVideostatus
}