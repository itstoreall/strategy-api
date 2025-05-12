import { IsObject, IsOptional } from 'class-validator';

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
  @IsObject({ message: 'TradeStrategy data is required!' })
  @IsOptional()
  data: TradeStrategy;
}
