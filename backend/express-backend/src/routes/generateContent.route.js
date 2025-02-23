import { Router } from "express";
import { generateFlashcards } from "../controllers/generateContent.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router = Router();

router.post("/flashcards",upload.fields([
    {name: "PPT", maxCount: 1},
    {name: "PDF", maxCount: 1}
]),verifyJWT, generateFlashcards);

export default router;
