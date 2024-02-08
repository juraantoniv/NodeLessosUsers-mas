import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { tokenRepository } from "../repositories/token.repository";

dayjs.extend(utc);
const tokensRemover = async () => {
  try {
    const date = dayjs().utc().subtract(6, "hour");
    await tokenRepository.deleteByParams({
      createdAt: { $lte: date },
    });
  } catch (e) {
    console.log(e);
  }
};

export const removeOldTokens = new CronJob("*/1000 * * * * *", tokensRemover);
