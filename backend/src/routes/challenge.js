import express from "express";
import { acceptChallenge, challengeCreate } from "../controllers/challengeContorller.js";

const router = express.Router();

router.post("/create",challengeCreate);
router.patch("/:id/accept",acceptChallenge);

export default router;