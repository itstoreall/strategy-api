import { IsString, IsUrl, IsDate } from 'class-validator';

export class DeleteVerifyCodeResDto {
  @IsString()
  identifier: string;

  @IsString()
  code: string;

  @IsUrl({}, { message: 'Invalid URL format' })
  url: string;

  @IsDate({ message: 'Invalid date format for expires' })
  expires: Date;
}
