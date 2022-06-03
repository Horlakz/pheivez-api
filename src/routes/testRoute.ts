// import router
import { Router } from "express";

// get controller
import testDemo from "../controllers/testController";

const router = Router();

// create route
router.get("/test", testDemo);

// export route(s)
export default router;
