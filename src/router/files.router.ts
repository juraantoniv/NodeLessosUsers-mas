import { Router } from "express";

import { filesController } from "../controlers/files.controler";
import { upload } from "../services/files.service";

const router = Router();

router.post("/files", upload.single("file"), filesController.upload);

export const filesRouter = router;
