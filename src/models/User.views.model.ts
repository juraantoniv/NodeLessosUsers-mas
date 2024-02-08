import { model, Schema, Types } from "mongoose";

import { Cars } from "./goodsModel";
import { User } from "./User.model";

const userSchemaViews = new Schema(
  {
    _carId: {
      type: Types.ObjectId,
      ref: Cars,
      required: true,
    },
    _userId: {
      type: Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const userViews = model<{
  _carId: Types.ObjectId;
  _userId: Types.ObjectId;
}>("userViews", userSchemaViews);
