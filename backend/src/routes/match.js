import express from "express";
import { SinglesMatchCreationController,DoublesMatchCreationController,getMatchDetailsController, getAllMatchesController, addSetResult} from "../controllers/matchController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"
const router = express.Router();

router.post("/matchCreation/singles",verifyToken,SinglesMatchCreationController);
router.post("/matchCreation/doubles",verifyToken,DoublesMatchCreationController);
router.get("/getMatchDetails/:id",getMatchDetailsController);
router.get("/getMatchHistory/:type",getAllMatchesController);
router.patch("/updateMatch/:id",addSetResult);
// router.delete("matches/:id");

export default router;