import { IsBoolean } from 'class-validator';

export class AccountStatusResDto {
  @IsBoolean({ message: 'Status must be a boolean value!' })
  status: boolean;
}
