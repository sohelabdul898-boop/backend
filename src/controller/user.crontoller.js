import asynHandler from "../utils/asynchandler.js"
import {apierror} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadonCloudinary } from "../utils/Cloudnary.js"
import { apiResponse } from "../utils/apiresponse.js"
const register = asynHandler(async (req, res) => {
    const { username, email, fullname, password } = req.body || {}
    console.log("email:", email);
    // if (fullname === "") {
    //     throw apierror(400,"fullname required")
    // }
    // if (password === "") {
    //     throw apierror(400,"password required")
    // }
    // if (email === "") {
    //     throw apierror(400,"email required")
    // }
    // if (username === "") {
    //     throw apierror(400,"username required")
    // }
    
    // second method
if(
    [fullname,email,username,password].some((field)=>!field||field.trim()==="")
){
throw new apierror(400,"All field are required")
}
 const existeduser =await User.findOne({
$or:[{username},{email}]
})
if(existeduser){
throw new apierror(409,"user already existed")
}
const avtarlocalpath = req.files?.avtar?.[0]?.path;
const coverImglocalpath = req.files?.coverImg?.[0]?.path;

if(!avtarlocalpath){
throw new apierror(400,"Avtar is required")
}
 const avtar = await uploadonCloudinary(avtarlocalpath)
 const coverimg = await uploadonCloudinary(coverImglocalpath)

 if(!avtar){
    throw new apierror(400,"Avtar is required")
 }
   const user = await User.create({
    fullname,
    avtar:avtar.url,
    coverimg:coverimg?.url || "",
    email,
    username:username.toLowerCase(),
    password,
})

    const createduser =await User.findById(user._id).select(
        "-password -refreshToken"
    )
if(!createduser){
throw new apierror(500,"something went wrong whileuser Register")
}

return res.status(201).json(
    new apiResponse(200,createduser,"user registerd succesfully")
)
})
export { register }
