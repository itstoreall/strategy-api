import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'A valid email is required!' })
  @IsNotEmpty()
  email: string;

  @IsString({ message: 'Password must be a string!' })
  @IsNotEmpty()
  password: string;
}
