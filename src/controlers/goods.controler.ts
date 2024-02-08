import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { EEmailAction } from "../enums/email.action.enum";
import { ERights } from "../enums/users.rights.enum";
import { ApiError } from "../errors/api.errors";
import { Cars } from "../models/goodsModel";
import { User } from "../models/User.model";
import { userViews } from "../models/User.views.model";
import {
  goodsPresenter,
  goodsPresenterForMany,
  presenterForPremium,
} from "../presenters/goods.presenter";
import { goodsRepository } from "../repositories/goods.repostitory";
import { buyDataService } from "../services/buy.data.service";
import { emailService } from "../services/email.service";
import { goodsService } from "../services/goods.services";
import { EFileTypes, s3Service } from "../services/s3.service";
import { tokenService } from "../services/tocken.service";
import { userService } from "../services/user.servise";
import { IGoods } from "../types/goods.types";
import { IPaginationResponse, IQuery } from "../types/pagination.type";
import { CarsValidator } from "../validators/cars.validator";

class GoodsController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IPaginationResponse<IGoods>>> {
    try {
      const goods = await goodsService.getAllWithPagination(
        req.query as IQuery,
      );
      const goodsImag = goodsPresenterForMany.present(goods);
      return res.json(goodsImag);
    } catch (e) {
      next(e);
    }
  }
  public async buyGoods(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    const { goodId } = req.body;
    const payload = req.res.locals.tokenPayload;
    const userWhoWantBuyCar = await User.findById(payload.userId).lean();

    try {
      const good = await goodsRepository.findGoodById(goodId);
      if (!good) {
        throw new ApiError(`Car is sold`, 404);
      }
      await goodsService.buyGoods(payload.userId, goodId);
      const goods = await goodsRepository.findGoodById(goodId);
      const user = await User.findById(goods.userId).lean();

      await Promise.all([
        buyDataService.create(goods, goods._id),
        Cars.deleteOne({ _id: goodId }),
        emailService.sendMail(user.email, EEmailAction.Buy, {
          user: userWhoWantBuyCar.name,
          email: userWhoWantBuyCar.email,
          city: userWhoWantBuyCar.city,
          brand: goods.model,
        }),
      ]);
      return res.json({
        data: goods,
      });
    } catch (e) {
      next(e);
    }
  }
  public async Create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    const accessToken = req.get("Authorization");

    const file = req.files.image as UploadedFile;

    try {
      const { userId } = tokenService.checkToken(accessToken, "access");

      console.log(userId);

      if (!userId) {
        throw new ApiError("Token not valid", 404);
      }

      const { error, value } = CarsValidator.create.validate({ ...req.body });
      if (error?.message.includes("[BMW, MERCEDES, OPEL]")) {
        const users = await User.find().lean();
        users.map((user) => {
          if (user.rights === ERights.Admin) {
            emailService.sendMail(user.email, EEmailAction.Card_Brand, {
              name: user.name,
              email: user.email,
              model: req.body.model,
            });
          }
        });
      }

      if (error) {
        throw new ApiError(error.message, 400);
      }

      const course = await axios.get(
        "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5",
      );
      const myObject: any = {};
      myObject.UAH = Number(value.currency);
      const arr = [];
      arr.push(
        myObject,
        {
          USD: Math.ceil(Number(value.currency) / Number(course.data[0].sale)),
        },
        {
          EUR: Math.ceil(Number(value.currency) / Number(course.data[1].sale)),
        },
      );
      const newGood = await goodsService.create({ ...value, currency: arr });
      const filePath = await s3Service.uploadFile(
        file,
        EFileTypes.Goods,
        newGood._id,
      );
      const good = await Cars.findOne({ _id: newGood._id }).lean();
      await Cars.findByIdAndUpdate(newGood.id, { image: filePath, userId });
      const goods = await goodsPresenter.present({ ...good, image: filePath });
      return res.status(201).json(goods);
    } catch (e) {
      next(e);
    }
  }
  public async Delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const accessToken = req.get("Authorization");
      const payload = tokenService.checkToken(accessToken, "access");
      const { id } = req.body;
      const car = await Cars.findById(id);
      if (car.userId !== payload.userId.toString()) {
        throw new ApiError(`You can't delete a car that not yours`, 400);
      }
      if (!id) {
        throw new ApiError("Something Wrong", 400);
      }
      await goodsService.deleteGood(id);
      return res.status(201).json("Car was deleted");
    } catch (e) {
      next(e);
    }
  }
  public async Update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const accessToken = req.get("Authorization");
      const payload = tokenService.checkToken(accessToken, "access");
      const { id } = req.params;
      const carForUpdate = req.body;
      const car = await Cars.findById(id).lean();
      if (car.userId !== payload.userId.toString()) {
        throw new ApiError(`You can't edit a car that not yours`, 400);
      }
      if (!car) {
        throw new ApiError("Car not found", 404);
      }

      const us = await goodsService.updateGood(id, carForUpdate);
      return res.status(201).json(us);
    } catch (e) {
      next(e);
    }
  }
  public async findByName(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { name } = req.params;
      const us = await userService.findUser(name);
      return res.status(201).json(us);
    } catch (e) {
      next(e);
    }
  }
  public async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const currentDate = new Date();
      const startOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      const viewsToday = await goodsRepository.findGoodsViews(startOfDay, id);
      const viewsWeek = await goodsRepository.findGoodsViewsWeek(
        startOfDay,
        id,
      );
      const us = await goodsService.getByCarId(id);
      const user = await User.findOne({ _id: us.userId }).lean();
      await userViews.create({ _carId: id, _userId: us.userId });
      us.views = us.views + 1;
      const goodsAfterView = await Cars.findByIdAndUpdate(id, us, {
        returnDocument: "after",
      }).lean();
      const goods =
        user.userPremiumRights === "premium"
          ? presenterForPremium.present(
              goodsAfterView,
              viewsToday.length,
              viewsWeek.length,
            )
          : goodsPresenter.present(goodsAfterView);
      return res.status(201).json(goods);
    } catch (e) {
      next(e);
    }
  }
  public async likes(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const car = await goodsService.getByCarId(id);
      car.likes = car.likes + 1;
      const goodsAfterView = await Cars.findByIdAndUpdate(id, car, {
        returnDocument: "after",
      }).lean();
      const goods = goodsPresenter.present(goodsAfterView);
      return res.status(201).json(goods);
    } catch (e) {
      next(e);
    }
  }
  public async dislikes(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const car = await goodsService.getByCarId(id);
      car.likes = car.likes - 1;
      const goodsAfterView = await Cars.findByIdAndUpdate(id, car, {
        returnDocument: "after",
      }).lean();
      const goods = goodsPresenter.present(goodsAfterView);
      return res.status(201).json(goods);
    } catch (e) {
      next(e);
    }
  }
}

export const goodsController = new GoodsController();
