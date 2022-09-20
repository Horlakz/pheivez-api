import { Router } from "express";

// get controllers
import {
  createArt,
  getArts,
  getArt,
  updateArt,
  deleteArt,
} from "../controllers/art";

// import middlewares
import { protect } from "../middlewares/auth";
import upload from "../config/multer";

// initialize express router
const router = Router();

// mount routes
router.route("/").post(upload.single("image"), protect, createArt).get(getArts);
router
  .route("/:slug")
  .get(getArt)
  .put(protect, updateArt)
  .delete(protect, deleteArt);

export default router;
