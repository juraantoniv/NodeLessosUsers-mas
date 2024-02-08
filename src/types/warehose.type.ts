import { Document } from "mongoose";

export interface IHouse extends Document {
  name_of_warehouse: string;
  city: string;
  sellerId: string;
}
