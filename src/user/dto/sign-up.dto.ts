import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'A valid email is required!' })
  @IsNotEmpty({ message: 'Email cannot be empty!' })
  email: string;

  @IsString({ message: 'Password must be a string!' })
  @IsNotEmpty({ message: 'Password cannot be empty!' })
  @MinLength(6, { message: 'Password must be at least 6 characters long!' })
  password: string;

  @IsString({ message: 'Name must be a string!' })
  @IsOptional()
  name?: string;
}
