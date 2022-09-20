import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  verifyPayment,
} from "../controllers/order";

import { protect } from "../middlewares/auth";

// initialize router
const router = Router();

// mount routes
router.route("/").get(getOrders).post(createOrder);
router
  .route("/:reference")
  .get(getOrder)
  .put(protect, updateOrder)
  .delete(deleteOrder);
router.route("/order/success").get(verifyPayment);

export default router;
