import { model, Schema } from "mongoose";
import mongoose from 'mongoose';
const SubscriptionSchema = new Schema({

subsciber:{
    typeof : Schema.Types.ObjectId,
    ref:"User"
},
channel :{
    typeof : Schema.Types.ObjectId,
    ref:"User"
},
},{
    timestamps:true
})
export const subscription = mongoose .model("subscription",SubscriptionSchema)