import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.errors";
import { User } from "../models/User.model";
import { UserValidator } from "../validators/user.validator";

class UserMiddleware {
  public async createOrThrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { value } = UserValidator.register.validate(req.body);
      const user = await User.findOne({ email: value.email });
      if (user) {
        throw new ApiError(`user with ${value.email} is already  in BD`, 404);
      }
      req.res.locals = user;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userMiddleware = new UserMiddleware();
