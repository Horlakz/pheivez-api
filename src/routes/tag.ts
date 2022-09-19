import { Router } from "express";

// get controllers
import { getTags, createTag, deleteTag } from "../controllers/tag";

// import middleware
import { protect } from "../middlewares/auth";

// initialize express router
const router = Router();

// mount routes
router.route("/").get(getTags).post(protect, createTag);
router.delete("/:id", protect, deleteTag);

export default router;
