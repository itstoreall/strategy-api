import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderTypeEnum, ExchangeEnum } from '../../enum';

export class CreateOrderDto {
  @IsEnum(OrderTypeEnum, { message: 'valid order type required!' })
  @IsNotEmpty()
  type: OrderTypeEnum;

  @IsString({ message: 'valid symbol required!' })
  @IsNotEmpty()
  symbol: string;

  @IsString({ message: 'valid exchange required!' })
  @IsNotEmpty()
  exchange: ExchangeEnum;

  @IsNumber({}, { message: 'valid amount required!' })
  @IsNotEmpty()
  amount: number;

  @IsNumber({}, { message: 'valid price required!' })
  @IsNotEmpty()
  price: number;

  @IsString({ message: 'valid userId required!' })
  @IsNotEmpty()
  userId: string;
}
