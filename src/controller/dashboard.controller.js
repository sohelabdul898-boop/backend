import mongoose from "mongoose";
import {asyncHandler} from "../utils/asynchandler.js"
import {apierror} from "../utils/ApiError.js"
import {Likes} from "../models/likes.model.js"
import {Video} from "../models/video.model.js"
import {subscription} from "../models/subscription.model.js"
import {apiresponse} from "../utils/apiresponse.js"

const  getchannelStats = asyncHandler(async(req,res)=>{

})
const getChannelVideos = asyncHandler(async(req,res)=>{

})
export {
    getchannelStats,
    getChannelVideos
}