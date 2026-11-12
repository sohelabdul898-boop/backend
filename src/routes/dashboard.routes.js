import { Router } from "express";
import { getChannelVideos,getchannelStats } from "../controller/dashboard.controller";
import { verifyJWT, VerifyJWT} from "../middleweras/auth.middleweare"
const router = Router()
router.use(verifyJWT)
router.route("/status").get(verifyJWT,getchannelStats)
router.route("/video").get(verifyJWT,getChannelVideos)
export default router
