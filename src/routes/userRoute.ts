// import router
import { Router } from "express";

// get controllers
import { register, login, getUser } from "../controllers/userController";

// initialize express router
const router = Router();

// create route
router.post("/register", register);
router.post("/login", login);
router.get("/me", getUser);

// export route(s)
export default router;
