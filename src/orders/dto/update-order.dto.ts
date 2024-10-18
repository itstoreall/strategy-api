import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { OrderStatusEnum } from '../../enum';

export class UpdateOrderDto {
  @IsNumber({}, { message: 'valid amount required!' })
  @IsOptional()
  @IsNotEmpty()
  amount?: number;

  @IsNumber({}, { message: 'valid price required!' })
  @IsOptional()
  @IsNotEmpty()
  price?: number;

  @IsEnum(OrderStatusEnum, { message: 'valid status required!' })
  @IsOptional()
  @IsNotEmpty()
  status?: OrderStatusEnum;
}
