import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors/api.errors";
import { User } from "../models/User.model";
import { tokenService } from "../services/tocken.service";
import { userService } from "../services/user.servise";
import { IUser } from "../types/user.type";

class UserController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.getAll();
      return res.json({
        data: users,
      });
    } catch (e) {
      next(e);
    }
  }
  public async Delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { id } = req.body;
      if (!id) {
        throw new ApiError("Something Wrong", 400);
      }
      await userService.deleteUser(id);
      return res.status(201).json("User was deleted");
    } catch (e) {
      next(e);
    }
  }
  public async Update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    const payload = req.res.locals.tokenPayload;
    try {
      const file = req.files.image as UploadedFile;

      console.log(file);

      const dto = req.body;
      const user = await User.findOne({ _id: payload.userId });
      if (!user) {
        throw new ApiError("User not found", 404);
      }

      console.log(req.body.avatar);

      const us = await userService.updateUser(payload.userId, dto, file);
      return res.status(201).json(us);
    } catch (e) {
      next(e);
    }
  }
  public async findByName(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { name } = req.params;
      const us = await userService.findUser(name);
      return res.status(201).json(us);
    } catch (e) {
      next(e);
    }
  }

  public async uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    const avatar = req.files.avatar as UploadedFile;

    try {
      const accessToken = req.get("Authorization");
      const payload = tokenService.checkToken(accessToken, "access");
      const user = await userService.uploadAvatar(avatar, payload.userId);
      return res.status(201).json(user);
    } catch (e) {}
  }
}

export const userController = new UserController();
