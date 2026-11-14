import mongoose, { set }  from "mongoose";
import  {apiResponse } from "../utils/apiresponse.js";
import  {apierror} from "../utils/ApiError.js";
import asynHandler from "../utils/asynchandler.js";
import {playlist, playlist} from "../models/playlist.model.js"
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import {Video} from "../models/video.model.js"

 const cretatePlyalist = asynHandler(async(req,res)=>{
const {name,description} = req.body
if(!name || name.trim() ==""){
   throw new apierror(400,"name is required")
}
if (!description || description.trim()=="") {
   throw new apierror(400,"description  is required")
}
const PlayList = await playlist.create({
   name : name.trim(),
   description: description.trim(),
   owner: req.user?._id
})
if(!PlayList){
throw new apierror(500,"failed to create playlist")
}
return res
.status(200)
.json(new apiResponse(200,playlist,"your playlist has been created"))
 })
const getUserPlaylist = asynHandler(async(req,res)=>{
const {userId} = req.params
if(!isValidObjectId(userId)){
   throw new apierror(400," user id is not valid")
}
const user  = await User.findById(userId)
if(!user){
   throw new apierror(404,"user not found")
}
const Playlist = await playlist.find({
   owner:req.user?._id
}).sort({
   createdAt:-1
})
return res
.status(200)
.json(new apiResponse(200,Playlist,"fetched user playlist"))
})
const getPlyalistById = asynHandler(async(req,res)=>{
const {playlistId} = req.params
})
const addVideoPlaylist = asynHandler(async(req,res)=>{
const {playlistId,videoId} = req.params
if (!isValidObjectId(playlistId)) {
   throw new apierror(400,"play list id is not valid")
}
if (!isValidObjectId(videoId)) {
   throw new apierror(400,"video is not valid")
}
const userplaylist = await playlist.findById(playlistId)
if(userplaylist.owner.toString() !== req.user._id.toString()){
throw new apierror(400,"you can add video only your playlist")
}
const video = await Video.findById(videoId)
if (!video) {
   throw new apierror(400,"video was not exist")
}
const addVideoplaylist = await playlist.findByIdAndUpdate(playlistId,{
   $addToSet:{
      videos:videoId,
   }
},{
   new :true
})
 return res
 .status(200)
 .json(new apiResponse(200,addVideoplaylist,"video was add on your playlist"))
})
const removeVideofromPlaylist = asynHandler(async(req,res)=>{
const {playlistId,videoId} = req.params
if(!isValidObjectId(playlistId)){
   throw new apierror(400,"play list is not valid")
}
if (!isValidObjectId(videoId)) {
   throw new apierror(400 ,"video id is not valid")
}
const userPlaylist  = await playlist.findById(playlistId)
if (userPlaylist.owner.toString() !== req.user?._id.toString()) {
   throw new apierror(400,"you can remove video from you playlist")
}
const Playlist = await playlist.findByIdAndUpdate(playlistId,{
   $pull:{
      videos:videoId
   }
},{
   new:true
})
 return res.status(200)
 .json(new apiResponse(200,Playlist,"your video is roemove from playlis"))
})
const deletplaylist = asynHandler(async(req,res)=>{
const {playlistId} = req.params
if (!isValidObjectId(playlistId)) {
   throw new apierror(400,"play list id is not valid")
}
const userplaylist = await playlist.findById(playlistId)
if (!userplaylist) {
   throw new apierror(400,"user play list was not found")
}
if (userplaylist.owner.toString() !== req.user?._id.toString()) {
   throw new apierror(400,"you can delet only your playlist")
}
const Playlist = await playlist.findByIdAndDelete(playlistId)
return res
.status(200)
.json(new apiResponse,Playlist,"your playlist was delted successfully")
})
const updatePlaylist = asynHandler(async(req,res)=>{
const {playlistId} = req.params
const {name,description} = req.body
if(!isValidObjectId(playlistId)){
throw new apierror(400,"playlist id is not valid")
}
if(!name || name.trim() == ""){
throw new apierror(400,"name is required")
}
if(!description || description.trim()==""){
throw new apierror(400,"description is required")
}
const userPlaylist = await playlist.findById(playlistId)
if (!userPlaylist) {
   throw new apierror(400," user playlist is not found")
}
if (userPlaylist.owner.toString() !== req.user?._id.toString()) {
   throw new apierror(400,"you can update only your playlist")
}
const Playlist = await playlist.findByIdAndUpdate(playlistId,
   {
$set:{
   name: name.trim(),
   description:description.trim()
}
},{
   new:true
}
)
return res.status(200).json(new apiResponse(200,Playlist,"your playlist has been updated"))
})
 export{
    cretatePlyalist,
    getUserPlaylist,
    getPlyalistById,
    addVideoPlaylist,
    removeVideofromPlaylist,
    deletplaylist,
    updatePlaylist
 }