import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/*
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

export class TradeStrategyDto {
  @IsNotEmpty({ message: 'Symbol must not be empty!' })
  symbol: string;

  @IsNotEmpty({ message: 'Exchange must not be empty!' })
  exchange: string;

  @IsNotEmpty({ message: 'Amount must not be empty!' })
  amount: string;

  @IsNotEmpty({ message: 'Average price must not be empty!' })
  avg: string;

  @IsNotEmpty({ message: 'Invested value must not be empty!' })
  invested: string;

  @IsNotEmpty({ message: 'Unrealized value must not be empty!' })
  unrealized: string;

  @IsNotEmpty({ message: 'Profit must not be empty!' })
  profit: string;

  @IsNotEmpty({ message: 'Orders must not be empty!' })
  orders: string;
}
*/

export class UpdateStrategyDto {
  @IsNumber({}, { message: 'Valid strategyId is required!' })
  @IsNotEmpty({ message: 'StrategyId must not be empty!' })
  strategyId: number;

  @IsString({ message: 'Valid data is required!' })
  @IsNotEmpty({ message: 'Data must not be string!' })
  data: string;

  /*
  @IsArray({ message: 'Data must be an array!' })
  @ValidateNested({ each: true })
  @Type(() => TradeStrategyDto)
  @IsNotEmpty({ message: 'Data must not be empty!' })
  data: TradeStrategyDto[];
  */
}
