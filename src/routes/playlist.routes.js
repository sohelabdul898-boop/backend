import { Router } from "express";
import { getPlyalistById,getUserPlaylist,updatePlaylist,deletplaylist,removeVideofromPlaylist,cretatePlyalist,addVideoPlaylist } from "../controller/playlist.controller.js";
import { verifyJWT } from "../middleweras/auth.middleweare.js";
const router = Router()
router.use(verifyJWT)
router.route("/").post(verifyJWT,cretatePlyalist)

router
    .route("/:playlistId")
    .get(verifyJWT,getPlyalistById)
    .patch(updatePlaylist)
    .delete(deletplaylist);

router.route("/add/:videoId/:playlistId").patch(verifyJWT,addVideoPlaylist);
router.route("/remove/:videoId/:playlistId").patch(verifyJWT,removeVideofromPlaylist);

router.route("/user/:userId").get(getUserPlaylist);
export default router