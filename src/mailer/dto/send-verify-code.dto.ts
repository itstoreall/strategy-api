import { IsString, IsNotEmpty, Length } from 'class-validator';

export class SendVerifyCodeDto {
  @IsString({ message: 'Identifier must be a string!' })
  @IsNotEmpty()
  identifier: string;

  @IsString({ message: 'Code must be a string!' })
  @IsNotEmpty()
  @Length(4, 4, { message: 'Code must be exactly 4 characters long!' })
  code: string;
}
