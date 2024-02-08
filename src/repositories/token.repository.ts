import {} from "express";
import { FilterQuery } from "mongoose";

import { Token } from "../models/Token.model";
import { IToken } from "../types/token.types";

export class TokenRepository {
  public async create(dto: Partial<IToken>): Promise<IToken> {
    return await Token.create(dto);
  }
  public async delete(params: FilterQuery<IToken>): Promise<void> {
    await Token.deleteOne(params);
  }
  public async findOne(params: FilterQuery<IToken>): Promise<IToken> {
    return await Token.findOne(params);
  }
  public async deleteManyByUserId(userId: string): Promise<void> {
    await Token.deleteMany({ _userId: userId });
  }
  public async deleteByParams(params: FilterQuery<IToken>): Promise<void> {
    await Token.deleteMany(params);
  }
}

export const tokenRepository = new TokenRepository();
