import { Router } from "express";
import { startAuth, respondAuth } from "../controllers/authController";

const router = Router();

router.post("/start", startAuth);
router.post("/respond", respondAuth);

export default router;
