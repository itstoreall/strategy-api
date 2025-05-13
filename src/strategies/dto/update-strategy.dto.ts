import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// export type TradeStrategy = {
//   symbol: string;
//   exchange: string;
//   amount: string;
//   avg: string;
//   invested: string;
//   unrealized: string;
//   profit: string;
//   orders: string;
// };

export class UpdateStrategyDto {
  @IsNumber({}, { message: 'valid strategyId required!' })
  @IsNotEmpty()
  strategyId: number;

  @IsString({ message: 'Amount must be a string!' })
  @IsNotEmpty()
  amount: string;
}
