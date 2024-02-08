import { model, Schema } from "mongoose";

import { ERights, EType } from "../enums/users.rights.enum";
import { IUser } from "../types/user.type";

const userSchema = new Schema(
  {
    password: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
    },
    confirmedRegistration: {
      type: Boolean,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    last_Visited: {
      typeof: String,
    },
    city: {
      type: String,
      required: true,
    },
    rights: {
      type: String,
      enum: ERights,
      default: ERights.Costumer,
    },
    userPremiumRights: {
      type: String,
      enum: EType,
      default: EType.Default,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("user", userSchema);
