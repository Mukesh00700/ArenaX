import express from "express";
import { requestHandler } from "../controllers/requestController";
const router = express.Router();

router.post("/createNotification",requestHandler);
export default router;