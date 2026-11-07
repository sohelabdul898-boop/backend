import {asynHandler} from "../utils/asynchandler.js";
import { apierror } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiresponse.js";
import { Video } from "../models/video.model.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudnary.js"
import mongoose,{isValidObjectId} from "mongoose";
const getallvideos = asynHandler(async(req,res)=>{

})
export{
    getallvideos
}