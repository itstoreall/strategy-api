import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVerifyCodeDto {
  @IsString({ message: 'Identifier must be a string!' })
  @IsNotEmpty()
  identifier: string;
}
