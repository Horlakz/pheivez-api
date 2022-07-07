// import router
import { Router } from "express";

// get controllers
import { register, login, getUser } from "../controllers/userController";

// middlewares
import { protect } from "../middlewares/auth";

// initialize express router
const router = Router();

// create route
router.post("/register", register);
router.post("/login", login);
router.get("/user", protect, getUser);

// export route(s)
export default router;
