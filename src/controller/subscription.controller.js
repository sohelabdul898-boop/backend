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
return res.status(200).json(new apiResponse(200,{isSubscribed:true},"subscribed succesfully"))
})
const getuserchannelsubscription = asncHandler(async(req,res)=>{
const {channelId} =req.params
if (!channelId) {
    throw new apierror(400,"channel id is not valid")
}
})
const getsubscriberchannel = asynHandler(async(req,res)=>{
const {subscriptionId} = req.params
if (!isValidObjectId(subscriptionId)){
    throw new apierror (400,"subscription id is not valid")
}
})
export{getsubscriberchannel,
    getuserchannelsubscription,
    togglesubscription}