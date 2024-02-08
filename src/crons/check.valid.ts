import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { EEmailAction } from "../enums/email.action.enum";
import { Cars } from "../models/goodsModel";
import { User } from "../models/User.model";
import { checkWordsService } from "../services/check.words.service";
import { emailService } from "../services/email.service";

dayjs.extend(utc);
const checkValid = async () => {
  try {
    const goods = await Cars.find().lean();
    goods.map(async (el) => {
      if (el.active === "nonActive" && el.countOfValid < 3) {
        const valid = checkWordsService.check(el.description);
        if (!valid) {
          const goods = await Cars.findOne({ _id: el._id }).lean();
          if (el.countOfValid < 3) {
            const user = await User.findById(goods.userId).lean();
            await Cars.findByIdAndUpdate(el._id, {
              countOfValid: goods.countOfValid + 1,
            });
            await emailService.sendMail(
              user.email,
              EEmailAction.Change_Advertising,
              { name: user.name, model: el.name },
            );
          }
        } else {
          await Cars.findByIdAndUpdate(el._id, { active: "active" });
        }
      } else {
        // console.log(`advertisement ok for ${el._id}`);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export const checkValidBody = new CronJob("*/100 * * * * *", checkValid);
