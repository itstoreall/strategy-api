import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
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
}
