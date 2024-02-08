import { model, Schema } from "mongoose";

const workerSchema = new Schema(
  {
    name: {
      type: String,
    },
    surname: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    age: {
      type: String,
    },
    city: {
      type: Boolean,
      required: true,
    },
    position: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const worker = model("worker", workerSchema);
