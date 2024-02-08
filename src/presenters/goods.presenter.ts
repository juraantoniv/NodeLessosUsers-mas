import { configs } from "../configs/config";
import { IGoods, IGoodsForMany } from "../types/goods.types";
import { IPaginationResponse } from "../types/pagination.type";

interface IPresenter<I, O> {
  present(payload: I): O;
}

class GoodsPresenter implements IPresenter<IGoods, Partial<IGoods>> {
  present(data: IGoodsForMany): Partial<IGoods> {
    return {
      userId: data.userId,
      model: data.model,
      name: data.name,
      description: data.description,
      type_currency: data.type_currency,
      currency: data.currency,
      boughtBy: data.boughtBy,
      dislikes: data.dislikes,
      active: data.active,
      views: data.views,
      likes: data.likes,
      image: `${configs.AWS_S3_URL}/${data.image}`,
    };
  }
}

export const goodsPresenter = new GoodsPresenter();

class GoodsPresenterForMany
  implements
    IPresenter<
      IPaginationResponse<IGoodsForMany>,
      Partial<IPaginationResponse<IGoodsForMany>>
    >
{
  present(
    data: IPaginationResponse<IGoodsForMany>,
  ): Partial<IPaginationResponse<IGoodsForMany>> {
    return {
      page: data.page,
      limit: data.limit,
      itemsFound: data.itemsFound,
      data: data.data.map((item) => ({
        _id: item._id,
        model: item.model,
        userId: item.userId,
        name: item.name,
        currency: item.currency,
        description: item.description,
        type_currency: item.type_currency,
        boughtBy: item.boughtBy,
        active: item.active,
        likes: item.likes,
        dislikes: item.dislikes,
        views: item.views,
        image: `${configs.AWS_S3_URL}/${item.image}`,
      })),
    };
  }
}

export const goodsPresenterForMany = new GoodsPresenterForMany();

class GoodsPresenterForPremium {
  present(data: IGoodsForMany, dayViews: number, weekViews: number) {
    return {
      weekViews: weekViews,
      dayViews: dayViews,
      userId: data.userId,
      name: data.name,
      description: data.description,
      type_currency: data.type_currency,
      currency: data.currency,
      boughtBy: data.boughtBy,
      dislikes: data.dislikes,
      views: data.views,
      likes: data.likes,
      image: `${configs.AWS_S3_URL}/${data.image}`,
    };
  }
}

export const presenterForPremium = new GoodsPresenterForPremium();
