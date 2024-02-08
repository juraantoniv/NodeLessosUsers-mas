import { Router } from "express";

import { userController } from "../controlers/user.controler";
import { ERights } from "../enums/users.rights.enum";
import { authMiddleware } from "../midlewares/auth.middleware";
import { fileMiddleware } from "../midlewares/files.midleware";
import { authMiddlewareForCheck } from "../midlewares/userAuthMidleware";
import { userMiddlewareForDel } from "../midlewares/userCheckIdMidleware";

const router = Router();

router.get(
  "",
  authMiddlewareForCheck.checkRightsOfUser(ERights.Admin),
  userController.getAll,
);
router.delete(
  "/delete",
  userMiddlewareForDel.deleteThrow,
  authMiddlewareForCheck.checkRightsOfUser(ERights.Admin),
  userController.Delete,
);
router.patch(
  "/update",
  authMiddlewareForCheck.checkUserForUpdate,
  authMiddleware.checkAccessToken,
  userController.Update,
);
router.get(":name", authMiddleware.checkAccessToken, userController.findByName);
router.post(
  "/uploadAvatar",
  fileMiddleware.isAvatarValid,
  userController.uploadAvatar,
);

export const userRouter = router;
