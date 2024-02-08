import { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { ApiError } from "../errors/api.errors";

class UserMiddlewareForDel {
  public async deleteThrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
      if (!mongoose.isObjectIdOrHexString(id)) {
        throw new ApiError("Not valid ID", 400);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userMiddlewareForDel = new UserMiddlewareForDel();
