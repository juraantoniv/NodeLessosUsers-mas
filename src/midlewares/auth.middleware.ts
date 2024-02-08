import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.errors";
import { User } from "../models/User.model";
import { tokenActiveRepository } from "../repositories/active.TokensRepository";
import { tokenRecoveryRepository } from "../repositories/password.recovery.repository";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/tocken.service";

class AuthMiddleware {
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const refreshToken = req.get("Refresh");
      if (!refreshToken) {
        throw new ApiError("No Token!", 401);
      }
      const entity = await tokenRepository.findOne({ refreshToken });
      const payload = tokenService.checkToken(refreshToken, "refresh");
      if (!entity) {
        throw new ApiError("Token not valid!", 401);
      }
      req.res.locals.tokenPayload = payload;
      req.res.locals.refreshToken = refreshToken;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const accessToken = req.get("Authorization");
      if (!accessToken) {
        throw new ApiError("No Token!", 401);
      }
      const entity = await tokenRepository.findOne({ accessToken });
      const payload = tokenService.checkToken(accessToken, "access");
      if (!entity) {
        throw new ApiError("Token not valid!", 401);
      }
      req.res.locals.tokenPayload = payload;
      req.res.locals.accessToken = accessToken;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkActiveToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { token } = req.body;
      const entity = await tokenRecoveryRepository.findOne({ token });
      if (!entity) {
        throw new ApiError("Token not valid!", 401);
      }
      const payload = tokenService.checkActiveToken(token);

      if (!token) {
        throw new ApiError("No Token!", 401);
      }
      await tokenActiveRepository.delete({ token });
      req.res.locals.payload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkRecoveryEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email });
      if (!user) {
        throw new ApiError(`User with ${email} not fount`, 404);
      }
      req.res.locals.email = email;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
