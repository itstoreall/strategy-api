import { IsString, IsInt, IsEnum, IsNotEmpty } from 'class-validator';

export enum StatusEnum {
  All = 'ALL',
  Init = 'INIT',
  Active = 'ACTIVE',
  Pending = 'PENDING',
}

export class TokenDto {
  @IsInt({ message: 'valid tokenId required!' })
  @IsNotEmpty()
  tokenId: number;

  @IsString({ message: 'valid symbol required!' })
  @IsNotEmpty()
  symbol: string;

  @IsString({ message: 'valid name required!' })
  @IsNotEmpty()
  name: string;

  @IsInt({ message: 'valid price required!' })
  @IsNotEmpty()
  price: number;

  @IsString({ message: 'valid pair required!' })
  @IsNotEmpty()
  pair: string;

  @IsEnum(StatusEnum, { message: 'valid status required!' })
  @IsNotEmpty()
  status: StatusEnum;
}
