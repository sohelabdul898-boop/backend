import mongoose, { isValidObjectId }  from "mongoose";
import { Comment } from "../models/comment.model.js";
import {apiResponse, apiresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"
import {apierror} from "../utils/ApiError.js"

const getVideoComment = asynchandler(async(req,res)=>{
const{videoId} = req.params
const {content} = req.body

if (!content || content.trim() ==="") {
    throw new apierror(400,"content is reqiured")
}
if(!isValidObjectId(videoId)){
    throw new apiresponse(400,"video id is not valid")
    }
const comment = Comment.create({
    content:content.trim(),
    video:videoId,
    owner:req?.user._id
})
if(!comment){
throw new apierror(400,"comment is not added")
}
return res
.status(200)
.json(new apiresponse(200,"your comment add successfully"))
})

const AddComment = asynchandler(async(req,res)=>{

})


const updatecomment = asynchandler(async(req,res)=>{
    const {commentId}= req.params
    const {content} = req.body
    if (!isValidObjectId(commentId)) {
        throw new apierror(400,"commnet ID is not valid")
    }
    if (!content || content.trim() ==="") {
    throw new apierror(400,"content is reqiured")
}
const usercomment = await Comment.findById(commentId)
if(!usercomment){
    throw new apierror(400,"user comment not found")
}
if(usercomment.owner.toString()!== req.user?._id.toString()){
throw new apierror(400,"you can only edit comment")
}
const comment = await Comment.findByIdAndUpdate(commentId,
    {
    $set:{
       content:content.trim()
    },
},{
    new:true,
}
)
return res.status(200)
.json(new apiResponse(200,"your comment has updated"))
})

const DeleteComment = asynchandler(async(req,res)=>{

})
export {
    getVideoComment,
    AddComment,
    updatecomment,
    DeleteComment
}   