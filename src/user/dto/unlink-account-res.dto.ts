import { IsBoolean } from 'class-validator';

export class UnlinkAccountResDto {
  @IsBoolean({ message: 'Unlinked status must be a boolean value!' })
  unlinked: boolean;
}
