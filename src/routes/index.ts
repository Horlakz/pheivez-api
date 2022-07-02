// express router
import { Router } from "express";

// app routes
import testRouter from "./testRoute";

// initialize express router
const router = Router();

// mount routes
router.use("/test", testRouter);

// export router
export default router;
