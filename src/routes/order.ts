import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order";

import { protect } from "../middlewares/auth";

// initialize router
const router = Router();

// mount routes
router.route("/").get(protect, getOrders).post(createOrder);
router
  .route("/:reference")
  .get(getOrder)
  .put(protect, updateOrder)
  .delete(deleteOrder);

export default router;
