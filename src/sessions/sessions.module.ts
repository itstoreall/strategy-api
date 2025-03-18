import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';

@Module({
  imports: [DatabaseModule],
  exports: [SessionsService],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
