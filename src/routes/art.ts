import { Router } from "express";

// get controllers
import { createArt } from "../controllers/art";

// import middlewares
import { protect } from "../middlewares/auth";

// initialize express router
const router = Router();

// mount routes
router.post("/", protect, createArt);

export default router;
