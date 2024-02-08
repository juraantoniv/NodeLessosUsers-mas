import { NextFunction, Request, Response } from "express";

import { ERights } from "../enums/users.rights.enum";
import { ApiError } from "../errors/api.errors";
import { User } from "../models/User.model";
import { tokenService } from "../services/tocken.service";

class AuthMiddlewareForCheck {
  public checkRightsOfUser(field: ERights) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const accessToken = req.get("Authorization");
      try {
        const payload = tokenService.checkToken(accessToken, "access");
        const user = await User.findById(payload.userId).lean();
        if (user.rights !== field) {
          throw new ApiError("You don have rights ", 401);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public async checkUserForUpdate(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const accessToken = req.get("Authorization");

      const payload = tokenService.checkToken(accessToken, "access");
      const user = await User.findById(payload.userId).lean();
      if (!payload || user.rights !== ERights.Admin) {
        throw new ApiError("You don have rights ", 401);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddlewareForCheck = new AuthMiddlewareForCheck();
