import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVerifyCodeDto {
  @IsString({ message: 'Identifier must be a string!' })
  @IsNotEmpty()
  identifier: string;

  // @IsString({ message: 'Code must be a string!' })
  // @IsNotEmpty()
  // code: string;
}
