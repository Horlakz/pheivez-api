import { Router } from "express";

import { getFile } from "../config/media";

const router = Router();

router.get("/:key", (req, res) => getFile(req.params.key).pipe(res));

export default router;
