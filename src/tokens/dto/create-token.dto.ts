import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTokenDto {
  @IsString({ message: 'valid symbol required!' })
  @IsNotEmpty()
  symbol: string;

  @IsString({ message: 'valid name required!' })
  @IsNotEmpty()
  name: string;
}
