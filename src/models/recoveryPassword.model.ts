import { model, Schema, Types } from "mongoose";

import { ITokenActive } from "../types/token.types";

const tokensRecoverySchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    _userId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const TokenRecovery = model<ITokenActive>(
  "RecoveryToken",
  tokensRecoverySchema,
);
