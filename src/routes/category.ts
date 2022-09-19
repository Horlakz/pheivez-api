import { Router } from "express";

// get controllers
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../controllers/category";

// import middlewares
import { protect } from "../middlewares/auth";

// initialize express router
const router = Router();

// mount routes
router.route("/").get(getCategories).post(protect, createCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
