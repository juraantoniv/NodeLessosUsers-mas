import { ECurrencyEnum } from "../enums/currency.enum";

export interface IQuery {
  currency?: ECurrencyEnum;
  page: string;
  limit: string;
  sortedBy: string;

  [key: string]: string;
}

export interface IPaginationResponse<T> {
  page: number;
  limit: number;
  itemsFound: number;
  data: T[];
}

export interface IPaginationResponseForMany<T> {
  page: number;
  limit: number;
  itemsFound: number;
  data: T[];
}
