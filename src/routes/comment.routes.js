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
router.route("/:videoId").get(getVideoComment).post()


export default router
