import { Router } from "express";
import {getallvideos} from "../controller/video.controller.js"
import { verifyJWT } from "../middleweras/auth.middleweare.js";
const router = Router()
router.use(verifyJWT)


export default router