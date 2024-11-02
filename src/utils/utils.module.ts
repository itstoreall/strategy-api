import { Module } from '@nestjs/common';
import { trimString } from './utils';

@Module({
  providers: [{ provide: 'TRIM_STRING', useValue: trimString }],
  exports: ['TRIM_STRING'],
})
export class UtilsModule {}
