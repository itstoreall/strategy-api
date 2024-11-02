import { IsString, IsEmail } from 'class-validator';

export class SignUpResDto {
  @IsString()
  id: string;

  @IsEmail({}, { message: 'Invalid email format in response!' })
  email: string;
}
