import { checkValidBody } from "./check.valid";
import { removeOldTokens } from "./remove.old.tokens";
import { updateCurrency } from "./update.currency";

export const cronRunner = () => {
  removeOldTokens.start();
  updateCurrency.start();
  checkValidBody.start();
};
