import { Router } from "express";
import {
    getVideoComment,
    AddComment,
    DeleteComment,
    updatecomment
} from "../controller/comment.controller.js";
import { verifyJwt } from "../middleweras/auth.middleweare.js"
const router = Router()

router.use(verifyJwt)

router.route("/:videoId").get(verifyJwt,getVideoComment).post(verifyJwt,AddComment)
router.route("/c/:commentId").delete(verifyJwt,DeleteComment).patch(verifyJwt,updatecomment)


export default router
