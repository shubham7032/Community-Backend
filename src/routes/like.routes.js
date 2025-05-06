import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addLike, getLikeCount } from "../controllers/like.controller.js";

const router = Router()

router.route("/LikeCount").get(verifyJWT,getLikeCount)
router.route("/AddLike").post(verifyJWT,addLike)

export default router