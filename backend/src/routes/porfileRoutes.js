import express from "express";
import {upload} from "../config/cloudinary.js"
import { verifyToken } from "../middlewares/authMiddleware.js";
import { updateProfilePicture,myProfileController } from "../controllers/profileController.js";

const router = express.Router();

router.get("/myProfile/:id",verifyToken,myProfileController);

router.put("/updateProfile",verifyToken,upload.single("profile"),updateProfilePicture);

// router.get("/userProfile",verifyToken,anyUserProfile);

export default router;