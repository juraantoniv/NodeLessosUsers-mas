import { NextFunction, Request, Response } from "express";

import { EType } from "../enums/users.rights.enum";
import { ApiError } from "../errors/api.errors";
import { Cars } from "../models/goodsModel";
import { User } from "../models/User.model";
import { tokenService } from "../services/tocken.service";

class PostCardMiddleware {
  public async postCar(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.get("Authorization");
      const payload = tokenService.checkToken(accessToken, "access");
      const cars = await Cars.find().lean();
      const user = await User.findById(payload.userId).lean();
      const findUser = cars.find(
        (el) => el.userId == payload.userId.toString(),
      );
      if (findUser && user.userPremiumRights === EType.Default) {
        throw new ApiError(
          "You can post only one , please buy premiumAccount",
          201,
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const cardMiddleware = new PostCardMiddleware();
