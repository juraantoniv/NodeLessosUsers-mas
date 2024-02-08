import { ApiError } from "../errors/api.errors";
import { Cars } from "../models/goodsModel";
import { goodsRepository } from "../repositories/goods.repostitory";
import { IGoods, IGoodsForMany } from "../types/goods.types";
import { IPaginationResponse, IQuery } from "../types/pagination.type";

class UserService {
  public async getAll(): Promise<IGoods[]> {
    const users = await goodsRepository.getAll();

    return users;
  }
  public async getAllWithPagination(
    query: IQuery,
  ): Promise<IPaginationResponse<IGoods>> {
    try {
      const queryStr = JSON.stringify(query);
      const queryObj = JSON.parse(
        queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`),
      );
      console.log(queryObj);
      const {
        page = 1,
        limit = 5,
        sortedBy = "createdAt",
        ...searchObject
      } = queryObj;

      const skip = +limit * (+page - 1);
      const [users, itemsFound] = await Promise.all([
        Cars.find(searchObject).limit(+limit).skip(skip).sort(sortedBy),
        Cars.count(searchObject),
      ]);

      console.log(users);

      return {
        page: +page,
        limit: +limit,
        itemsFound: itemsFound,
        data: users,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async create(user: IGoods): Promise<IGoods> {
    return await goodsRepository.Create(user);
  }

  public async deleteGood(id: string): Promise<void> {
    await goodsRepository.Delete(id);
  }
  public async updateGood(id: string, user: IGoods): Promise<IGoods> {
    return await goodsRepository.update(id, user);
  }
  public async findUser(name: string): Promise<any> {
    return await goodsRepository.findByName(name);
  }
  public async buyGoods(userId: IGoods, goodId: string): Promise<IGoods> {
    return await goodsRepository.findByIdUpdate(userId, goodId);
  }
  public async getByCarId(carId: string): Promise<IGoodsForMany> {
    return await goodsRepository.findGoodById(carId);
  }
}

export const goodsService = new UserService();
