import { Router } from "express";
import { ToggleVideoLike } from "../controller/like.controller.js";
import { verifyJWT } from "../middleweras/auth.middleweare.js";
const router = Router()
router.use(verifyJWT)



export default router