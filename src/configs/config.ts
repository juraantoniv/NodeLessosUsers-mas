import { config } from "dotenv";
config();

export const configs = {
  DB_URI: process.env.DB_URL,
  SECRET_SALT: process.env.SECRET_SALT,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL,
  PASS: process.env.PASS,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_BUCKED: process.env.AWS_BUCKED,
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_URL: process.env.AWS_S3_URL,
  API_KEY: process.env.API_KEY,
};
