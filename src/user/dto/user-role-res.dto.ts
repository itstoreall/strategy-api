import { IsString } from 'class-validator';

export class UserRoleResDto {
  @IsString({ message: 'Role must be a string!' })
  role: 'USER' | 'ADMIN';
}
