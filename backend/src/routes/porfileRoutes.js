import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/myProfile",verifyToken,myProfileController);

router.put("/updateProfile",verifyToken,updateProfileController);

router.get("/userProfile",verifyToken,anyUserProfile);