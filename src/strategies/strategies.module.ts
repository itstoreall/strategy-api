import { Module } from '@nestjs/common';
import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [StrategiesController],
  providers: [StrategiesService, DatabaseService],
})
export class StrategiesModule {}