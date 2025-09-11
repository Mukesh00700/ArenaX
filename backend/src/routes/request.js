import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js"
import { acceptRequest, allRequestRecieved, allRequestSent, createRequest, rejectRequest } from "../controllers/requestController.js";
const router = express.Router();

router.post("/createRequest",createRequest);
router.patch("/:id/accept",acceptRequest);
router.patch("/:id/reject",rejectRequest);
router.get("/recieved",verifyToken,allRequestRecieved);
router.get("/sent",verifyToken,allRequestSent);

export default router;