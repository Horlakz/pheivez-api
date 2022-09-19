// express router
import { Router } from "express";

// app routes
import userRoutes from "./user";
import newsLetterRoutes from "./newsletter";
import artRoutes from "./art";

// initialize express router
const router = Router();

// mount routes
router.use("/auth", userRoutes);
router.use("/subscribers", newsLetterRoutes);
router.use("/art", artRoutes);

// export router
export default router;
