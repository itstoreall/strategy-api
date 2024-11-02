import { IsNumber } from 'class-validator';

export class DeleteTokensResDto {
  @IsNumber({}, { message: 'Deleted count must be a number!' })
  deletedCount: number;
}
