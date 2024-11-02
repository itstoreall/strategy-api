import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateVerifyCodeResDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsDate()
  expires: Date;
}
