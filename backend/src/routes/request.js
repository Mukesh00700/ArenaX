import express from "express";
import { acceptRequest, allRequestRecieved, allRequestSent, createRequest, rejectRequest } from "../controllers/requestController.js";
const router = express.Router();

router.post("/createRequest",createRequest);
router.patch("/:id/accept",acceptRequest);
router.patch("/:id/reject",rejectRequest);
router.get("/recieved",allRequestRecieved);
router.get("/sent",allRequestSent);

export default router;