import { Router } from "express";
import { ToggleVideoLike,toggleCommentLiked,toggleTweetliked,GetlikedVideos } from "../controller/like.controller.js";
import { verifyJWT } from "../middleweras/auth.middleweare.js";
const router = Router()
router.use(verifyJWT)

router.route("/toggle/v/:videoId").post(verifyJWT,ToggleVideoLike)
router.route("/toggle/c/:commentId").post(verifyJWT,toggleCommentLiked)
router.route("/toggle/t/:tweetId").post(verifyJWT,toggleTweetliked)
router.route("/videos").get(GetlikedVideos)
export default router