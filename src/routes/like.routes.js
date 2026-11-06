import { Router } from "express";
import { ToggleVideoLike,toggleCommentLiked,toggleTweetliked,GetlikedVideos } from "../controller/like.controller.js";
import { verifyJWT } from "../middleweras/auth.middleweare.js";
const router = Router()
router.use(verifyJWT)



export default router