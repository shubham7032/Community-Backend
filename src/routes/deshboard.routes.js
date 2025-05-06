import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addCard, deleteCard, getAllCards } from "../controllers/deshboard.controller.js";

const router = Router()

router.route("/gelAllcards").get(getAllCards)
router.route("/addCard").post(verifyJWT,upload.single("photo"),addCard)
router.route("/DeleteCard").delete(deleteCard)

export default router