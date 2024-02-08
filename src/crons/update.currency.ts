import axios from "axios";
import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Cars } from "../models/goodsModel";

dayjs.extend(utc);

const currencyUpdater = async () => {
  try {
    const course = await axios.get(
      "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5",
    );
    const goods = await Cars.find().lean();
    await Promise.all([
      goods.map(async (el) => {
        const prices = [
          { UAN: el.currency },
          { EUR: Math.ceil(Number(el.currency) / Number(course.data[0].sale)) },
          { USD: Math.ceil(Number(el.currency) / Number(course.data[1].sale)) },
        ];
        await Cars.findByIdAndUpdate(el._id, { price: prices });
      }),
    ]);
  } catch (e) {
    console.log(e);
  }
};
export const updateCurrency = new CronJob("*/1000 * * * * *", currencyUpdater);
