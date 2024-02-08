import { FilterQuery, UpdateQuery } from "mongoose";

import { Cars } from "../models/goodsModel";
import { userViews } from "../models/User.views.model";
import { IGoods } from "../types/goods.types";

class GoodsRepository {
  public async getAll(): Promise<IGoods[]> {
    return await Cars.find();
  }

  public async Create(goods: IGoods): Promise<IGoods> {
    const good = await Cars.create(goods);
    return good;
  }

  public async Delete(id: string): Promise<void> {
    await Cars.findByIdAndDelete(id);
  }
  public async update(id: string, newUser: IGoods): Promise<IGoods> {
    return await Cars.findByIdAndUpdate(id, newUser);
  }
  public async findByName(name: string): Promise<IGoods[]> {
    const user = await Cars.find({ name: name });

    return user;
  }
  public async findByID(userId: FilterQuery<IGoods>): Promise<IGoods[]> {
    const user = await Cars.find({ userId });

    return user;
  }
  public async findByIdUpdate(userId: IGoods, goodId: string): Promise<IGoods> {
    const good = await Cars.findByIdAndUpdate(goodId, { boughtBy: userId });

    return good;
  }
  public async findByIdImageUpdate(
    image: UpdateQuery<IGoods>,
    goodId: string,
  ): Promise<IGoods> {
    const good = await Cars.findByIdAndUpdate(goodId, { image }).lean();

    return good;
  }
  public async findGoodById(goodId: string): Promise<IGoods> {
    const good = await Cars.findById(goodId).lean();

    return good;
  }

  public async findGoodsViews(date: Date, id: string) {
    const currentDate = new Date();
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
    );
    return userViews.find({
      _carId: id,
      createdAt: { $gte: date, $lt: endOfDay },
    });
  }
  public async findGoodsViewsWeek(date: Date, id: string) {
    const currentDate = new Date();
    const endOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 7,
    );
    return userViews.find({
      _carId: id,
      createdAt: { $gte: date, $lt: endOfWeek },
    });
  }
}

export const goodsRepository = new GoodsRepository();
