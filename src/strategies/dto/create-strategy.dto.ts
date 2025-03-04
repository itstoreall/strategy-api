import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { StrategyStatusEnum, StrategyTypeEnum } from '../../enum';

export class CreateStrategyDto {
  @IsEnum(StrategyTypeEnum, { message: 'valid strategy type required!' })
  @IsNotEmpty()
  type: StrategyTypeEnum;

  @IsString({ message: 'valid symbol required!' })
  @IsNotEmpty()
  symbol: string;

  @IsEnum(StrategyStatusEnum, { message: 'valid status required!' })
  @IsNotEmpty()
  status: StrategyStatusEnum;

  @IsString({ message: 'valid userId required!' })
  @IsNotEmpty()
  userId: string;

  @IsObject({ message: 'valid data JSON required!' })
  @IsOptional()
  data?: Record<string, any>;
}
