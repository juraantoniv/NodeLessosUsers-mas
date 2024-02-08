import joi from "joi";

import { ECars } from "../enums/cars.enum";

export class CarsValidator {
  static goodsName = joi.string().min(2).max(50).trim();
  static description = joi.string().min(5).required();
  static image = joi.binary().optional();
  static price = joi.string().required();
  static currency = joi.string().required();
  static model = joi
    .valid(...Object.values(ECars))
    .messages({ err: "Brand i not valid" })
    .required();

  static create = joi.object({
    name: this.goodsName.required(),
    description: this.description.required(),
    image: this.image,
    type_currency: this.price.required(),
    currency: this.currency.optional(),
    model: this.model,
  });

  static update = joi.object({
    name: this.goodsName.optional(),
    price: this.price.optional(),
  });
}
