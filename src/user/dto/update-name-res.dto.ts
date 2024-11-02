import { IsBoolean } from 'class-validator';

export class UpdateNameResDto {
  @IsBoolean()
  updated: boolean;
}
