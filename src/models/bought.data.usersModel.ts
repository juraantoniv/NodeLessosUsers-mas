import { model, Schema, Types } from "mongoose";

import { BoughtType } from "../types/goods.types";
import { Cars } from "./goodsModel";

const BoughtSchema = new Schema(
  {
    _goodsId: {
      type: Types.ObjectId,
      required: true,
      ref: Cars,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: false,
    },
    boughtBy: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export const boughtSchema = model<BoughtType>("boughtSchema", BoughtSchema);
