import mongoose ,{isValidObjectId} from "mongoose";
import  apiResponse  from "../utils/apiresponse.js";
import  apierror from "../utils/ApiError.js";
import asynHandler from "../utils/asynchandler.js";
import playlist from "../models/playlist.model.js"
import { isValidObjectId } from "mongoose";

 const cretatePlyalist = asynHandler(async(req,res)=>{
const {name,description} = req.body
 })
const getUserPlaylist = asynHandler(async(req,res)=>{
const {userId} = req.params
})
const getPlyalistById = asynHandler(async(req,res)=>{
const {playlistId} = req.params
})
const addVideoPlaylist = asynHandler(async(req,res)=>{
const {playlistId,videoId} = req.params
})
const removeVideofromPlaylist = asynHandler(async(req,res)=>{
const {playlistId,videoId} = req.params
})
const deletplaylist = asynHandler(async(req,res)=>{
const {playlistId} = req.params
})
const updatePlaylist = asynHandler(async(req,res)=>{
const {playlistId} = req.params
const {name,description} = req.body
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