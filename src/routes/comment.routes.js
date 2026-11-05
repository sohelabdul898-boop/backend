import { Router } from "express";
import {
    getVideoComment,
    AddComment,
    DeleteComment,
    updatecomment
} from "../controller/comment.controller.js";
import { verifyJWT } from "../middleweras/auth.middleweare.js";
const router = Router()

router.use(verifyJWT)

router.route("/:videoId").get(verifyJWT,getVideoComment).post(verifyJWT,AddComment)
router.route("/c/:commentId").delete(verifyJWT,DeleteComment).patch(verifyJWT,updatecomment)


export default router
