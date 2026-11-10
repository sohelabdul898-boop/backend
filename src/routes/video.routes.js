import { Router } from "express";
import { upload } from "../middleweras/multer.midlewear.js";
import {
    getallvideos,
    publishedVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    toggleVideostatus} from "../controller/video.controller.js"
import { verifyJWT } from "../middleweras/auth.middleweare.js";
const router = Router()
router.use(verifyJWT)
router.route("/").get(getallvideos)
.post (
    upload.fields([
{
    name:"videoFile",
    maxCount:1,
},
{
    name:'thumbnail',
    maxCount:1,
}


    ]),
    publishedVideo
);
router
.route("/:videoId")
.get(verifyJWT,getVideoById)
.delete(verifyJWT,deleteVideo)
.patch(upload.single("thumbnail"),verifyJWT,
updateVideo)
router.route("/toggle/publish/:videoId").patch(verifyJWT,toggleVideostatus)
export default router