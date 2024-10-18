import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderTypeEnum } from '../../enum';

export class CreateOrderDto {
  @IsEnum(OrderTypeEnum, { message: 'valid order type required!' })
  @IsNotEmpty()
  type: OrderTypeEnum;

  @IsString({ message: 'valid symbol required!' })
  @IsNotEmpty()
  symbol: string;

  @IsNumber({}, { message: 'valid amount required!' })
  @IsNotEmpty()
  amount: number;

  @IsNumber({}, { message: 'valid price required!' })
  @IsNotEmpty()
  price: number;
}
