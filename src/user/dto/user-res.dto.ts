import { IsString, IsEmail, IsDate, IsOptional } from 'class-validator';

export class UserResDto {
  @IsEmail({}, { message: 'A valid email is required!' })
  email: string;

  @IsDate({ message: 'Verification date must be a valid date!' })
  @IsOptional()
  verified: Date;

  @IsString({ message: 'Password must be a string!' })
  password: string;
}
