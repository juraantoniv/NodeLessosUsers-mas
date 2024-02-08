import { buyDataRepository } from "../repositories/bought.data.repository";
import { BoughtType } from "../types/goods.types";

class BuyDataService {
  public async getAll(): Promise<BoughtType[]> {
    return await buyDataRepository.getAll();
  }
  public async create(data: BoughtType, goodsId: string): Promise<void> {
    await buyDataRepository.create(data, goodsId);
  }
  public async getByUserId(id: string): Promise<BoughtType[]> {
    return await buyDataRepository.getByUserId(id);
  }
}

export const buyDataService = new BuyDataService();
