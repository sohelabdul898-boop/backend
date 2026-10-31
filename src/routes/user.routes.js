import { Router } from "express"
import { upload } from "../middleweras/multer.midlewear.js"

import {
    changecurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    getuserwatchHistory,
    loginUser,
    logoutuser,
    RefreshToken,
    register,
    updateAccount,
    UpdateCoverImage,
    updteUserAvtar
} from "../controller/user.crontoller.js"
import { verifyJWT } from "../middleweras/auth.middleweare.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avtar",
            maxCount: 1
        },
        {
            name: "coverImg",
            maxCount: 1
        }
    ]),
    register
)
router.route("/login").post(loginUser)


// secure routes
router.route("/logout").post(verifyJWT, logoutuser)
router.route("/refresh-token").post(RefreshToken)
router.route("/change-password").post(verifyJWT, changecurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-AccountDetail").patch(verifyJWT, updateAccount)
router.route("/avtar").patch(verifyJWT, upload.single("avtar"), updteUserAvtar)
router.route("/coverimg").patch(verifyJWT, upload.single("coverimg"), UpdateCoverImage)
router.route("update-account").patch(verifyJWT, updateAccount)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/History").get(verifyJWT, getuserwatchHistory)
export default router