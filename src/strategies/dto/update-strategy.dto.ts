import { IsNotEmpty, IsString } from 'class-validator';

export type TradeStrategy = {
  symbol: string;
  exchange: string;
  amount: string;
  avg: string;
  invested: string;
  unrealized: string;
  profit: string;
  orders: string;
};

export class UpdateStrategyDto {
  @IsString({ message: 'valid data required!' })
  @IsNotEmpty()
  data?: string;
}
