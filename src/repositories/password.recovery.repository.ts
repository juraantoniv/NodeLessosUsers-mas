import {} from "express";
import { FilterQuery } from "mongoose";

import { TokenActive } from "../models/activeToken.model";
import { TokenRecovery } from "../models/recoveryPassword.model";
import { ITokenActive } from "../types/token.types";

export class TokenRecoveryRepository {
  public async create(dto: Partial<ITokenActive>): Promise<ITokenActive> {
    return await TokenRecovery.create(dto);
  }
  public async delete(params: any): Promise<void> {
    await TokenRecovery.deleteOne(params);
  }
  public async findOne(
    token: FilterQuery<ITokenActive>,
  ): Promise<typeof TokenActive> {
    return await TokenRecovery.findOne(token);
  }
}

export const tokenRecoveryRepository = new TokenRecoveryRepository();
