import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadDocument } from "../controllers/documents.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/upload-material").post(
  verifyJWT,
  upload.fields([
    { name: "PPT", maxCount: 3 },
    {
      name: "PDF",
      maxCount: 3,
    },
  ]),
  uploadDocument
);

export default router