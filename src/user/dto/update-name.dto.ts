import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateNameDto {
  @IsString({ message: 'User ID must be a string!' })
  @IsNotEmpty()
  userId: string;

  @IsString({ message: 'Name must be a string!' })
  @IsNotEmpty()
  name: string;
}
