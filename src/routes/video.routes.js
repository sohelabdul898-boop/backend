import { Router } from "express";
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
router.route("/:videoId")
.get(getVideoById)
.delete(deleteVideo)
.patch(upload.single("thumbnail"),updateVideo)
router.route("/toggle/publish/:videoId").patch(toggleVideostatus)
export default router