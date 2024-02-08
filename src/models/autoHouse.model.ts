import { model, Schema, Types } from "mongoose";

import { IHouse } from "../types/warehose.type";
import { User } from "./User.model";
import { worker } from "./workers.model";

const houseSchema = new Schema(
  {
    name_of_warehouse: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    _sellerId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
    workers: {
      type: String,
      ref: worker,
    },
  },
  { timestamps: true, versionKey: false },
);

export const house = model<IHouse>("house", houseSchema);
