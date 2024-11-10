import { Module } from '@nestjs/common';
import { trimString, generateVerifyCode } from './utils';

@Module({
  providers: [
    { provide: 'TRIM_STRING', useValue: trimString },
    { provide: 'GENERATE_VERIFY_CODE', useValue: generateVerifyCode },
  ],
  exports: ['TRIM_STRING', 'GENERATE_VERIFY_CODE'],
})
export class UtilsModule {}
