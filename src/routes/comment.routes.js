import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getAllComment } from "../controllers/comment.controller.js";

const router = Router()


router.route("/getAllComment").get(verifyJWT,getAllComment)
router.route("AddComment").patch(verifyJWT,addComment)
router.route("/DeleteComment").delete(deleteComment)

export default router