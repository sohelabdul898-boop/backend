import { Router } from "express";
import { createTweet } from "../controller/tweet.controller.js";
import {verifyJwt} from "../middleweras/auth.middleweare.js"
const router = Router()
router.use(verifyJwt)





export default router