import { Router } from "express";
import { getsubscriberchannel,getuserchannelsubscription,togglesubscription } from "../controller/subscription.controller.js";
import { verifyJWT } from "../middleweras/auth.middleweare.js"
const router = Router()
router.use(verifyJWT)
router
    .route("/c/:channelId")
    .get(getsubscriberchannel)
    .post(togglesubscription);

router.route("/u/:subscriberId").get(getuserchannelsubscription);

export default router