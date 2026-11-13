import mongoose from "mongoose";
// import {asyncHandler} from "../utils/asynchandler.js"
import asyncHandler from "../utils/asynchandler.js";
// import {apierror} from "../utils/ApiError.js"
import {Likes} from "../models/likes.model.js"
import {Video} from "../models/video.model.js"
import {subscription} from "../models/subscription.model.js"
import {apiResponse} from "../utils/apiresponse.js"

const  getchannelStats = asyncHandler(async(req,res)=>{
const videoStats = await Video.aggregate([
    {
$match:{
    owner:mongoose.Types.ObjectId(req.user?._id)
}
},
{
    $group:{
        _id:null,
        totalVideos:{$sum:1},
        totalViews:{$sum:"$views"}

    }
}
])


const totalsubscriber = await subscription.countDocuments({
    channel:req.user?._id
})
const VideosId = await Video.find({owner:req.user?._id}).distinct(_id)
const totalLikes = await Likes.countDocuments({
    video:{$in:VideosId}
})
const stats = {
totalVideos:videoStats[0]?.totalVideos || 0,
totalViews:videoStats[0]?.totalViews || 0,
totalsubscriber,
totalLikes,
}
return res.status(200).json(new apiResponse(200,stats,"Get video channel  stats fetched successfully"))
})
const getChannelVideos = asyncHandler(async(req,res)=>{

const UserVideo = await Video.findById({
    owner:req.user?._id
}).sort({
    createdAt:-1
})
return res
.status(200)
.json(new apiResponse(200,UserVideo,"channel video fetched succesfully"))
})
export {
    getchannelStats,
    getChannelVideos
}