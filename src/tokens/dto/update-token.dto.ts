import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TokenStatusEnum } from '../../enum';

export class UpdateTokenDto {
  @IsString({ message: 'valid name required!' })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsEnum(TokenStatusEnum, { message: 'valid status required!' })
  @IsOptional()
  @IsNotEmpty()
  status?: TokenStatusEnum;
}

/*
import { PartialType } from '@nestjs/mapped-types';
import { CreateTokenDto } from './create-token.dto';
export class UpdateTokenDto extends PartialType(CreateTokenDto) {}
*/
