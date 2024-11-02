import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateCredentialsDto {
  @IsEmail({}, { message: 'A valid email is required!' })
  @IsNotEmpty()
  email: string;

  @IsString({ message: 'Password must be a string!' })
  @IsNotEmpty()
  password: string;

  @IsString({ message: 'Code must be a string!' })
  @IsNotEmpty()
  code: string;
}
