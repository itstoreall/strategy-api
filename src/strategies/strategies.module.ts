import { Module } from '@nestjs/common';
import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';
import { DatabaseService } from '../database/database.service';

@Module({
  exports: [StrategiesService],
  controllers: [StrategiesController],
  providers: [StrategiesService, DatabaseService],
})
export class StrategiesModule {}
