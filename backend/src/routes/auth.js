import express from "express";
import {login,signup,googleAuth,completeProfile} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/google",googleAuth);
router.post("/google/complete-profile",completeProfile);

export default router;
