import express from "express";
import { acceptChallenge, challengeCreate, allChallengeSent, allChallengeRecieved, rejectChallenge } from "../controllers/challengeContorller.js";
import { verifyToken } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/create",challengeCreate);
router.patch("/:id/accept",acceptChallenge);
router.patch("/:id/reject",rejectChallenge);

router.get("/recieved/Single",verifyToken,allChallengeRecieved);
router.get("/recieved/Team",verifyToken,allChallengeRecieved);

router.get("/sent/Single",verifyToken,allChallengeSent);
router.get("/sent/Team",verifyToken,allChallengeSent);

export default router;