import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";
import {apierror} from "../utils/ApiError.js"
import asncHandler from "../utils/asynchandler.js"
import { subscription} from "../models/subscription.model.js"
import asynHandler from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiresponse.js"
import {User} from "../models/user.model.js"
const togglesubscription = asncHandler(async(req,res)=>{
const {channelId } = req.params
if (!isValidObjectId(channelId)) {
    throw new apierror(400,"channel id is not valid")
}
const user = await User.findById(channelId)
if (!user) {
    throw new apierror(400,"user does not exist")
}
if (channelId === req.user?._id.toString()) {
    throw new apierror(400,"channel id was not matched with user id")
}
const existingsubscription = await subscription.findOne({subscriber:req.user?._id,channel:channelId})
if (existingsubscription) {
    subscription.findByIdAndDelete(existingsubscription._id)
    return res.status(200).json(new apiResponse(200,{isSubscribed:false},"unsubscribed successfully"))
}
await subscription.create({subscriber:req.user?._id,channel:channelId})
return res.status(200)
.json(new apiResponse(200,{isSubscribed:true},"subscribed succesfully"))
})
const getuserchannelsubscription = asncHandler(async(req,res)=>{
const {channelId} =req.params
if (!channelId) {
    throw new apierror(400,"channel id is not valid")
}
const userChannelsubscribed = await subscription.aggregate([
    {$match:{
channel :new mongoose.Types.ObjectId(channelId)
    }
},{
$lookup:{
    from:"user",
    localField:"subscriber",
    foreignField:"_id",
    as:"subscriber",
    pipeline:[
        {
            $project:{
                username:1,
                fullname:1,
                avtar:1,
            }
        }
    ]
}
},
{
    $unwind:"$subscriber"
}
])
return res.staus(200).json(new apiResponse(200,userChannelsubscribed,"get all user channel they subscribed"))
})
const getsubscriberchannel = asynHandler(async(req,res)=>{
const {subscriptionId} = req.params
if (!isValidObjectId(subscriptionId)){
    throw new apierror (400,"subscription id is not valid")
}
const subscribedchannel = await subscription.aggregate([
    {
$match:{
    subscriber:new mongoose.Types.ObjectId(subscriptionId)
}
},{
    $lookup:{
        from:"users",
        localField:"channel",
        foreignField:"_id",
        as:"channel",
        pipeline:[
            {
$project:{username:1,fullname:1,avtar:1}
        }
    ]
    }
},{
    $unwind:"$channel"
},{
    $project:{
        _id:0,
        channel:1,
        subscribedAt:"$createdAt"
    }
}
])
return res
.status(200)
.json(new apiResponse(200,subscribedchannel,"subscribed channel fetch succefully"))
})
export{getsubscriberchannel,
    getuserchannelsubscription,
    togglesubscription}