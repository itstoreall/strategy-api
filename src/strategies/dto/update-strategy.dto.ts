import { IsObject, IsOptional } from 'class-validator';

export class UpdateStrategyDto {
  @IsObject({ message: 'valid data JSON required!' })
  @IsOptional()
  data: Record<string, any>;
}
