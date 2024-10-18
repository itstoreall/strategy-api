import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { StrategyStatusEnum } from '../../enum';

export class UpdateStrategyDto {
  @IsEnum(StrategyStatusEnum, { message: 'valid status required!' })
  @IsOptional()
  @IsNotEmpty()
  status?: StrategyStatusEnum;
}
