import { Router } from "express"
import { upload } from "../middleweras/multer.midlewear.js"

import { loginUser, logoutuser, RefreshToken, register } from "../controller/user.crontoller.js"
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

export default router