import { StatusEnum } from '../enum';

export type Token = {
  symbol: string;
  name: string;
  price: number;
  status: StatusEnum;
};

export type TokenUpdate = Pick<Token, 'symbol' | 'name'> & {
  price?: number;
  status?: StatusEnum;
};
