import { Router } from "express";
import { createTweet,deleteTweet,updatetweet,getUsertweet } from "../controller/tweet.controller.js";
import { verifyJWT } from "../middleweras/auth.middleweare.js";
const router = Router()
router.use(verifyJWT)

router.route("/").post(verifyJWT,createTweet)
router.route("/user/:userId").get(verifyJWT,getUsertweet)
router.route("/:tweetId").patch(verifyJWT,updatetweet)

export default router