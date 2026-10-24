import asynHandler from "../utils/asynchandler.js"
import { apierror } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadonCloudinary } from "../utils/Cloudnary.js"
import { apiResponse } from "../utils/apiresponse.js"


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
    const logeduser = User.findById(user._id).select("-password -refreshToken")
    const option = {
        httpOnly: true,
        secure: true,
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
    User.findByIdAndUpdate(req.user._id,
        {

            $set: {
                refreshToken: undefined
            }

        }, {
        new: true
    }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new apiResponse(200, {}, "user logged out"))
})


export {
    register,
    loginUser, logoutuser
}
