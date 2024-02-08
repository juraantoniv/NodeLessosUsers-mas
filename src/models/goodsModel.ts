import { model, Schema } from "mongoose";

import { ECars } from "../enums/cars.enum";
import { EActive } from "../enums/valiid.enum";
import { IGoods } from "../types/goods.types";

const carsSchema = new Schema(
  {
    userId: {
      type: String,
    },
    model: {
      type: String,
      enum: ECars,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    type_currency: {
      type: String,
      required: false,
    },
    currency: {
      type: [],
    },
    boughtBy: {
      type: String,
      required: false,
    },
    views: {
      type: Number,
      default: 0,
      required: false,
    },
    likes: {
      type: Number,
      default: 0,
      required: false,
    },
    dislikes: {
      type: Number,
      default: 0,
      required: false,
    },
    active: {
      type: String,
      enum: EActive,
      default: EActive.Nonactive,
      required: false,
    },
    countOfValid: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Cars = model<IGoods>("cars", carsSchema);
