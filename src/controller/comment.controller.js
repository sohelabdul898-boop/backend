import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { apiResponse } from "../utils/apiresponse.js"
import asynHandler from "../utils/asynchandler.js";
import { apierror } from "../utils/ApiError.js"

const getVideoComment = asynHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query
    if (!isValidObjectId(videoId)) {
        throw new apierror(400, "video id is not valid")
    }
    // const commentAggregate = Comment.aggregate([
    //     {
    //         $match: {
    //             video: mongoose.Types.ObjectId(videoId),
    //             _id: new ObjectId(videoId)
    //         }, 
    // $lookup: {
    //             from: "users",
    //             localField: "owner",
    //             foreignField: "_id",
    //             as: "owner",
    //             pipeline: [
    //                 {
    //                     $project: {
    //                         username: 1,
    //                         fulname: 1,
    //                         avtar: 1
    //                     }
    //                 }
    //             ]
            
    //     },
    //         $lookup: {
    //             from: "likes",
    //             localField: "_id",
    //             foreignField: "comment",
    //             as: "likes"
    //         }
    //     }, {
    //         $addFields: {
    //             owner: {
    //                 $first: "$owner"
    //             }, likesCount: {
    //                 $size: "$likes"
    //             },
    //             isLikes: {
    //                 $cond: {
    //                     if: { $in: [req.user?._id, "$likes.likedBy"] }
    //                     , then: true,
    //                     else: false
    //                 }
    //             }
    //         }

    //     }, {
    //         $project: {
    //             content: 1,
    //             createdAt: 1,
    //             likesCount: 1,
    //             owner: 1,
    //             isLikes: 1
    //         }
    //     }, {
    //         $sort: {
    //             createdAt: -1
    //         }
    //     }
    // ]
    // )
    const commentAggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fulname: 1,
                            avtar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                likesCount: {
                    $size: "$likes"
                },
                isLikes: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                likesCount: 1,
                owner: 1,
                isLikes: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);
    const option = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }
    const comment = await Comment.aggregatePaginate(commentAggregate, option)

    return res.status(200).
        json(new apiResponse(200, comment, "comment fetched successfully"))

}

)

const AddComment = asynHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body

    if (!content || content.trim() === "") {
        throw new apierror(400, "content is reqiured")
    }
    if (!isValidObjectId(videoId)) {
        throw new apierror(400, "video id is not valid")
    }
    const comment = Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req?.user._id
    })
    if (!comment) {
        throw new apierror(400, "comment is not added")
    }
    return res
        .status(200)
        .json(new apiResponse(200, "your comment add successfully"))
})


const updatecomment = asynHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body
    if (!isValidObjectId(commentId)) {
        throw new apierror(400, "commnet ID is not valid")
    }
    if (!content || content.trim() === "") {
        throw new apierror(400, "content is reqiured")
    }
    const usercomment = await Comment.findById(commentId)
    if (!usercomment) {
        throw new apierror(400, "user comment not found")
    }
    if (usercomment.owner.toString() !== req.user?._id.toString()) {
        throw new apierror(400, "you can only edit comment")
    }
    const comment = await Comment.findByIdAndUpdate(commentId,
        {
            $set: {
                content: content.trim()
            },
        }, {
        new: true,
    }
    )
    return res.status(200)
        .json(new apiResponse(200, "your comment has updated"))
})

const DeleteComment = asynHandler(async (req, res) => {
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new apierror(404, "comment Id is not valid")
    }
    const usercomment = await Comment.findById(commentId)
    if (!usercomment) {
        throw new apierror(401, "user comment is not found")
    }
    if (usercomment.owner.toString() !== req.user?._id.toString()) {
        throw new apierror(401, "you can only delete your own comment")
    }
    const comment = await Comment.findByIdAndDelete(commentId)
    return res.status(200)
        .json(new apiResponse(200, {}, "your comment was successfully deleted"))
})
export {
    getVideoComment,
    AddComment,
    updatecomment,
    DeleteComment
}   