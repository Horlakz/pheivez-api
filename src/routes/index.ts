// express router
import { Router } from "express";

// app routes
import userRoutes from "./user";
import newsLetterRoutes from "./newsletter";

// initialize express router
const router = Router();

// mount routes
router.use("/auth", userRoutes);
router.use("/subscribers", newsLetterRoutes);

// export router
export default router;
