import { Document, Types } from "mongoose";

export interface IGoods extends Document {
  _id: string;
  userId?: string;
  name?: string;
  description?: string;
  image?: string;
  currency: string;
  type_currency?: string;
  boughtBy?: Types.ObjectId;
  views?: number;
  likes?: number;
  model?: string;
  dislikes?: number;
  active?: string;
  countOfValid?: number;
}

export type IGoodsForMany = Pick<
  IGoods,
  | "userId"
  | "type_currency"
  | "boughtBy"
  | "description"
  | "image"
  | "name"
  | "views"
  | "likes"
  | "dislikes"
  | "_id"
  | "currency"
  | "active"
  | "model"
>;

export interface BoughtType extends Document {
  _goodsId?: Types.ObjectId;
  name?: string;
  description?: string;
  price?: string;
  boughtBy?: Types.ObjectId | IGoods;
}

export type CurrencyType = {
  [key: string]: number;
};
