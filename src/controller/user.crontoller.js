import asynHandler from "../utils/asynchandler.js"
import { apierror } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadonCloudinary } from "../utils/Cloudnary.js"
import { apiResponse } from "../utils/apiresponse.js"
import jwt from "jsonwebtoken"
import mongoose, { Schema } from "mongoose"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new apierror(500, "something went wrong while generating refresh Token and accessToken")
    }
}

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
    if (
        [fullname, email, username, password].some((field) => !field || field.trim() === "")
    ) {
        throw new apierror(400, "All field are required")
    }
    const existeduser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existeduser) {
        throw new apierror(409, "user already existed")
    }
    const avtarlocalpath = req.files?.avtar?.[0]?.path;
    const coverImglocalpath = req.files?.coverImg?.[0]?.path;

    if (!avtarlocalpath) {
        throw new apierror(400, "Avtar is required")
    }
    const avtar = await uploadonCloudinary(avtarlocalpath)
    const coverimg = await uploadonCloudinary(coverImglocalpath)

    if (!avtar) {
        throw new apierror(400, "Avtar is required")
    }
    const user = await User.create({
        fullname,
        avtar: avtar.url,
        coverimg: coverimg?.url || "",
        email,
        username: username.toLowerCase(),
        password,
    })

    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createduser) {
        throw new apierror(500, "something went wrong whileuser Register")
    }

    return res.status(201).json(
        new apiResponse(200, createduser, "user registerd succesfully")
    )
})
const loginUser = asynHandler(async (req, res) => {


    const { username, email, password } = req.body || {}
    if (!username && !email) {
        throw new apierror(400, "username or email is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apierror(404, "user does not exist")
    }

    const ispasswordvalid = await user.isPasswordCorrect(password)

    if (!ispasswordvalid) {
        throw new apierror(401, "invalid user credintial")
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const logeduser = await User.findById(user._id).select("-password -refreshToken")
    const option = {
        httpOnly: true,
        secure: false,
    }

    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new apiResponse(
                200, {
                user: logeduser, accessToken, refreshToken
            },
                "user logedin Successfuly"
            )
        )
})
const logoutuser = asynHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {

            $unset: {
                refreshToken: 1
            }

        }, {
        new: true
    }
    )

    const option = {
        httpOnly: true,
        secure: false,
    }

    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new apiResponse(200, {}, "user logged out"))
})

const RefreshToken = asynHandler(async (req, res) => {
    const incomingResfreshToken = req.cookies.refreshToken || req.body.refreshToken
    // in ther wrong right
    if (!incomingResfreshToken) {
        throw new apierror(401, "unauthorized request")
    }


    try {
        const decodedToken = jwt.verify(
            incomingResfreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new apierror(401, "invalid refresh token")
        }

        if (incomingResfreshToken !== user?.refreshToken) {
            throw new apierror(401, " refreshtoken is expired or used")
        }

        const option = {
            httpOnly: true,
            secure: true,
        }
        const { accessToken, NewrefreshToken } = await generateAccessAndRefreshToken(user._id)
        return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", NewrefreshToken, option)
            .json(new apiResponse(
                200,
                { accessToken, refreshToken: NewrefreshToken },
                "Access token refreshed"
            ))

    } catch (error) {
        throw new apierror(401, "Invalid  Refresh Token")
    }
})
const changecurrentPassword = asynHandler(async (req, res) => {
    const { oldPassword, newPassord } = req.body
    const user = await User.findAndCount(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new apierror(401, "the old password is not correct")
    }
    user.password = newPassord
    await user.save({ validateBeforeSave: false })
    return res.status(200)
        .json(new apiResponse(200, {}, "Password Changed Successfully"))
})
const getCurrentUser = asynHandler(async (req, res) => {
    return res.status(200)
        .json(200, req.user, "Current User fetched Successfully")
})

const updateAccount = asynHandler(async (req, res) => {
    const { fullname, email } = req.body
    if (!fullname || !email) {
        throw new apierror(401, "fullname and email are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                fullname: fullname,
                email: email
            }
        }, {
        new: true
    }
    ).select("-password")
    return
    res
        .status(200)
        .json(new apiResponse(200, user, "Your has updated"))
})

const updteUserAvtar = asynHandler(async (req, res) => {
    const avtarLocalPath = req.file?.path
    if (!avtarLocalPath) {
        throw new apierror(401, "avtar was required")
    }
    const avtar = await uploadonCloudinary(avtarLocalPath)
    if (!avtar.url) {
        throw new apierror(401, "error while uploading avtar")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                avtar: avtar.url
            }
        }, {
        new: true
    }
    ).select("-password")
    return res.status(200)
        .json(new apiResponse(200, user, "Your Avtar has been Updated"))
})


const UpdateCoverImage = asynHandler(async (req, res) => {
    const CoverimgLocalPath = req.file?.path
    if (!CoverimgLocalPath)
        throw new apierror(401, "Cover Image has required")

    const coverImg = await uploadonCloudinary(CoverimgLocalPath)

    if (!coverImg.url) {
        throw apierror(401, "coverimg was not uploaded")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            coverImg: coverImg.url
        }
        , {
            new: true
        }
    ).select("-password")
    return res.status(200)
        .json(200, user, "Your Cover Img has been Updated")
})

const getUserChannelProfile = asynHandler(async (req, res) => {
    const { username } = req.params
    if (!username?.trim()) {
        throw new apierror(401, "there is no user namne")
    }

    const channel = await User.aggregate(
        [
            {
                $match: {
                    username: username?.toLowerCase()
                }
            }, {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscibers"
                }
            }, {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subsciber",
                    as: "subscibersTo"
                }

            }, {
                $addFields: {
                    SubsciberCounts: {
                        $size: "$subscibers",
                    },
                    channelsToCount: {
                        $size: "subscibersTo",
                    },
                    isSubscribed: {
                        $cond: {
                            if: { $in: [req.user?._id, "$subscibers.subsciber"] },
                            then: true,
                            else: false
                        }
                    }
                }
            }, {
                $project: {
                    fullname: 1,
                    email: 1,
                    username: 1,
                    avtar: 1,
                    coverImg: 1,
                    SubsciberCounts: 1,
                    channelsToCount: 1,
                    isSubscribed: 1
                }
            }

        ]
    )
    if (!channel?.length) {
        throw new apierror(404, "there is no channel is exist")
    }
    return res
        .status(200)
        .json(
            new apiResponse(200, channel[0], "User channel Fetched successfully")
        )
})
const getuserwatchHistory = asynHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        }, {
            $lookup: {
                from: "videos",
                localField: " WatchHistory",
                foreignField: _id,
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        avtar: 1,
                                        username: 1,
                                    }
                                }
                            ]
                        }

                    }
                ]
            }
        },{
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        }
        
    ])

    res
    .status(200)
    .json(
        new apiResponse(
            200,user[0].watchHistory,
            "watch History fetched Successfully"
        )
    )

})
export {
    register,
    loginUser,
    logoutuser,
    RefreshToken,
    changecurrentPassword,
    updateAccount,
    getCurrentUser,
    updteUserAvtar,
    UpdateCoverImage,
    updateAccount,
    getUserChannelProfile
    , getuserwatchHistory
}
