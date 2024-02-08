import { boughtSchema } from "../models/bought.data.usersModel";
import { BoughtType } from "../types/goods.types";

export class ByDataRepository {
  public async create(dto: BoughtType, goodsId: string): Promise<BoughtType> {
    return await boughtSchema.create({ ...dto, _goodsId: goodsId });
  }
  public async getAll(): Promise<BoughtType[]> {
    return await boughtSchema.find();
  }
  public async getByUserId(id: string): Promise<BoughtType[]> {
    return await boughtSchema.find({ boughtBy: id });
  }
}

export const buyDataRepository = new ByDataRepository();
