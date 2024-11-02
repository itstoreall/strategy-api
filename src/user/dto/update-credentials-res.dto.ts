import { IsBoolean } from 'class-validator';

export class UpdateCredentialsResDto {
  @IsBoolean()
  updated: boolean;
}
