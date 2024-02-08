import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { NextFunction, Request, Response } from "express";

import { EEmailAction } from "../enums/email.action.enum";
import { ApiError } from "../errors/api.errors";
import { TokenRecovery } from "../models/recoveryPassword.model";
import { Token } from "../models/Token.model";
import { User } from "../models/User.model";
import { userPresenter } from "../presenters/user.presenter";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { authService } from "../services/auth.service";
import { emailService } from "../services/email.service";
import { passwordService } from "../services/password.service";
import { tokenService } from "../services/tocken.service";
import { ITokenPayload, ITokensPair } from "../types/token.types";
import { UserValidator } from "../validators/user.validator";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const { error, value } = UserValidator.register.validate(req.body);
      await authService.register(value);
      if (error) {
        throw new ApiError(error.message, 400);
      }
      return res.status(201).json("User Created");
    } catch (e) {
      next(e);
    }
  }
  public async registerSeller(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const { error, value } = UserValidator.register.validate(req.body);
      await authService.registerSeller(value);
      if (error) {
        throw new ApiError(error.message, 400);
      }
      return res.status(201).json("User Created");
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const { error, value } = UserValidator.login.validate(req.body);
      if (error) {
        throw new ApiError(error.message, 400);
      }
      const user = await User.findOne({ email: value.email });
      const tokensPair = await authService.login(value);
      return res.json({
        user: userPresenter.present(user),
        tokens: tokensPair,
      });
    } catch (e) {
      next(e);
    }
  }
  public async registerManager(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const { error, value } = UserValidator.register.validate(req.body);
      await authService.registerManager(value);
      if (error) {
        throw new ApiError(error.message, 400);
      }
      return res.status(201).json("User Created");
    } catch (e) {
      next(e);
    }
  }
  public async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const payload = req.res.locals.tokenPayload;
      const accessToken = req.res.locals.accessToken;
      await tokenRepository.delete({ accessToken });
      await Token.deleteMany({ _userId: payload.userId });
      return res.json("LogOut succeed");
    } catch (e) {
      next(e);
    }
  }
  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const refreshToken = req.res.locals.refreshToken as string;
      dayjs.extend(utc);
      const day = dayjs().utc().format("DD/MM/YYYY HH:mm:ss ").toString();
      const userForUpdate = await User.findById(tokenPayload.userId);
      await userRepository.updateName(tokenPayload.userId.toString(), {
        ...userForUpdate,
        last_Visited: day,
      });
      const tokensPair = await authService.refresh(tokenPayload, refreshToken);
      console.log(tokensPair);
      return res.status(201).json(tokensPair);
    } catch (e) {
      next(e);
    }
  }

  public async recordPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const tokenPayload = req.res.locals.payload as ITokenPayload;
      const { password, old_password } = req.body;
      const user = await User.findOne({ _id: tokenPayload.userId });
      const compare = await passwordService.compare(
        old_password,
        user.password,
      );

      if (!compare) {
        throw new ApiError("Password invalid", 404);
      }

      user.password = await passwordService.hash(password);
      await User.findByIdAndUpdate(tokenPayload.userId, user);

      return res.status(201).json("Password was changed");
    } catch (e) {
      next(e);
    }
  }
  public async recoveryPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const email = req.res.locals.email;
      const user = await User.findOne({ email });
      const token = tokenService.generateTokenRecovery({
        name: user.name,
        userId: user._id,
      });
      await TokenRecovery.create({ _userId: user._id, token: token });
      await emailService.sendMail(user.email, EEmailAction.FORGOT_PASSWORD, {
        name: user.name,
        token: token,
      });
      return res.status(201).json("Password was activated");
    } catch (e) {
      next(e);
    }
  }
  public async me(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const payload = req.res.locals.tokenPayload;
      const user = await userRepository.findByID(payload.userId);
      const presenter = userPresenter.present(user);
      return res.status(201).json(presenter);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
