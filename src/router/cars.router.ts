import { Router } from "express";

import { buyController } from "../controlers/buy.controler";
import { goodsController } from "../controlers/goods.controler";
import { ERights } from "../enums/users.rights.enum";
import { authMiddleware } from "../midlewares/auth.middleware";
import { cardMiddleware } from "../midlewares/postCard.midleware";
import { authMiddlewareForCheck } from "../midlewares/userAuthMidleware";
import { userMiddlewareForDel } from "../midlewares/userCheckIdMidleware";

const router = Router();

router.get("", authMiddleware.checkAccessToken, goodsController.getAll);
router.get(
  "/getById/:id",
  authMiddleware.checkAccessToken,
  goodsController.findById,
);
router.post("/buy", authMiddleware.checkAccessToken, goodsController.buyGoods);
router.get("/getUsersCars", buyController.getAllBuId);
router.post(
  "/create",
  cardMiddleware.postCar,
  // authMiddlewareForCheck.checkRightsOfUser(ERights.Seller),
  goodsController.Create,
);
router.delete(
  "/delete",
  userMiddlewareForDel.deleteThrow,
  authMiddlewareForCheck.checkRightsOfUser(ERights.Seller),
  goodsController.Delete,
);
router.patch(
  "updateCar/",
  authMiddleware.checkAccessToken,
  goodsController.Update,
);
router.get(
  ":name",
  authMiddleware.checkAccessToken,
  goodsController.findByName,
);
router.post(
  "/likes/:id",
  authMiddleware.checkAccessToken,
  goodsController.likes,
);
router.post(
  "/dislikes/:id",
  authMiddleware.checkAccessToken,
  goodsController.dislikes,
);

export const carsRouter = router;
