import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoPlaylist, getPlatlist } from "../controllers/playlist.controller.js";

const router = Router()

router.route("/getPlayList").get(verifyJWT,getPlatlist)
router.route("/addVideoInPlayList").patch(verifyJWT,addVideoPlaylist)
router.route("/removeVideo").delete(verifyJWT,)

export default router