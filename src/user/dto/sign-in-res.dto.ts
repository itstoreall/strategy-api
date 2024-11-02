import { IsString, IsEmail, IsEnum } from 'class-validator';

export class SignInResDto {
  @IsString()
  id: string;

  @IsEmail({}, { message: 'Invalid email format in response!' })
  email: string;

  @IsString()
  name: string;

  @IsEnum(['USER', 'ADMIN'], { message: 'Role must be either USER or ADMIN' })
  role: 'USER' | 'ADMIN';
}
