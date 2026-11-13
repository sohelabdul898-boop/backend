import { Router } from "express";
import { getChannelVideos,getchannelStats } from "../controller/dashboard.controller.js";
import { verifyJWT} from "../middleweras/auth.middleweare.js";
const router = Router()

router.use(verifyJWT)

router.route("/status").get(verifyJWT,getchannelStats)
router.route("/video").get(verifyJWT,getChannelVideos)


export default router