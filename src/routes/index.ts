import { Router } from "express";

// app routes
import userRoutes from "./user";
import newsLetterRoutes from "./newsletter";
import artRoutes from "./art";
import categoryRoutes from "./category";
import tagRoutes from "./tag";
import mediaRoutes from "./media";
import orderRoutes from "./order";
import locationRoutes from "./location";

// initialize express router
const router = Router();

// mount routes
router.use("/auth", userRoutes);
router.use("/subscriber", newsLetterRoutes);
router.use("/art", artRoutes);
router.use("/category", categoryRoutes);
router.use("/tag", tagRoutes);
router.use("/media", mediaRoutes);
router.use("/order", orderRoutes);
router.use("/location", locationRoutes);

// export router
export default router;
