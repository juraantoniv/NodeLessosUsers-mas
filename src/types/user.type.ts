import { Document } from "mongoose";

import { ERights, EType } from "../enums/users.rights.enum";

export interface IUser extends Document {
  name?: string;
  password?: string;
  email?: string;
  age?: string;
  city?: string;
  confirmedRegistration?: boolean;
  avatar?: string;
  last_Visited?: string;
  rights?: ERights;
  userPremiumRights: EType;
}

export type IUserCredentials = Pick<
  IUser,
  "email" | "password" | "confirmedRegistration"
>;
export type IUserCredentialsForSeller = Pick<
  IUser,
  "email" | "password" | "confirmedRegistration" | "rights"
>;
