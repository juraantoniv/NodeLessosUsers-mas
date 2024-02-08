import { Router } from "express";

import { authController } from "../controlers/auth.controler";
import { ERights } from "../enums/users.rights.enum";
import { authMiddleware } from "../midlewares/auth.middleware";
import { userMiddleware } from "../midlewares/user.midleware";
import { authMiddlewareForCheck } from "../midlewares/userAuthMidleware";

const router = Router();

router.post("/register", userMiddleware.createOrThrow, authController.register);
router.post(
  "/sellerRegister",
  userMiddleware.createOrThrow,
  authMiddlewareForCheck.checkRightsOfUser(ERights.Admin),
  authController.registerSeller,
);
router.post(
  "/managerRegister",
  userMiddleware.createOrThrow,
  authMiddlewareForCheck.checkRightsOfUser(ERights.Admin),
  authController.registerManager,
);
router.post("/login", authController.login);
router.get("/me", authMiddleware.checkAccessToken, authController.me);
router.get(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);
router.post(
  "/changePassword",
  authMiddleware.checkActiveToken,
  authController.recordPassword,
);
router.post("/logout", authMiddleware.checkAccessToken, authController.logout);
router.post(
  "/recoveryPassword",
  authMiddleware.checkRecoveryEmail,
  authController.recoveryPassword,
);

export const authRouter = router;
