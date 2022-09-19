import { Router } from "express";

// get controllers
import {
  addSubscriber,
  verifySubscriber,
  getSubscribers,
  unsubscribe,
} from "../controllers/newsletter";

// initialize express router
const router = Router();

// middlewares
import { protect } from "../middlewares/auth";

// create route
router.route("/").post(addSubscriber).get(protect, getSubscribers);
router.put("/verify/:id", verifySubscriber);
router.delete("/:id", unsubscribe);

// export route(s)
export default router;
