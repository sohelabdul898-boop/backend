import { Router } from "express"
import { upload } from "../middleweras/multer.midlewear.js"

import { register } from "../controller/user.crontoller.js"

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

export default router