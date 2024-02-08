import { EEmailAction } from "../enums/email.action.enum";
import { ERights } from "../enums/users.rights.enum";
import { ApiError } from "../errors/api.errors";
import { User } from "../models/User.model";
import { tokenActiveRepository } from "../repositories/active.TokensRepository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { ITokenPayload, ITokensPair } from "../types/token.types";
import { IUserCredentials } from "../types/user.type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./tocken.service";

class AuthService {
  public async register(dto: IUserCredentials): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(dto.password);
      const user = await userRepository.register({
        ...dto,
        password: hashedPassword,
        confirmedRegistration: false,
      });
      const token = tokenService.generateTokenActive({
        userId: user._id,
        name: user.name,
      });
      await tokenActiveRepository.create({ token: token, _userId: user._id });
      await emailService.sendMail(user.email, EEmailAction.REGISTER, {
        name: user.name,
        token: token,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async registerSeller(dto: IUserCredentials): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(dto.password);
      const user = await userRepository.register({
        ...dto,
        password: hashedPassword,
        confirmedRegistration: false,
        rights: ERights.Seller,
      });
      const token = tokenService.generateTokenActive({
        userId: user._id,
        name: user.name,
      });
      await tokenActiveRepository.create({ token: token, _userId: user._id });
      await emailService.sendMail(user.email, EEmailAction.REGISTER, {
        name: user.name,
        token: token,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async login(dto: IUserCredentials): Promise<ITokensPair> {
    try {
      const user = await User.findOne({ email: dto.email });
      if (!user) {
        throw new ApiError("Invalid credentials provided", 401);
      }
      const isMatch = await passwordService.compare(
        dto.password,
        user.password,
      );
      if (!isMatch) {
        throw new ApiError("Invalid credentials provided", 401);
      }
      const tokensPair = tokenService.generateTokenPair({
        name: user.name,
        userId: user._id,
      });
      await tokenRepository.create({ ...tokensPair, _userId: user._id });

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async registerManager(dto: IUserCredentials): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(dto.password);
      const user = await userRepository.register({
        ...dto,
        password: hashedPassword,
        confirmedRegistration: false,
        rights: ERights.Manager,
      });
      const token = tokenService.generateTokenActive({
        userId: user._id,
        name: user.name,
      });
      await tokenActiveRepository.create({ token: token, _userId: user._id });
      await emailService.sendMail(user.email, EEmailAction.REGISTER, {
        name: user.name,
        token: token,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async refresh(
    payload: ITokenPayload,
    refreshToken: string,
  ): Promise<ITokensPair> {
    try {
      const tokensPair = tokenService.generateTokenPair({
        userId: payload.userId,
        name: payload.name,
      });

      await Promise.all([
        tokenRepository.create({ ...tokensPair, _userId: payload.userId }),
        tokenRepository.delete({ refreshToken }),
      ]);

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
