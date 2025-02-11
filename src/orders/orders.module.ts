import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { OrdersController } from './orders.controller';
import { BinanceService } from '../binance/binance.service';
import { OrdersService } from './orders.service';
import { StrategiesModule } from 'src/strategies/strategies.module';

@Module({
  imports: [DatabaseModule, StrategiesModule],
  controllers: [OrdersController],
  providers: [OrdersService, BinanceService],
})
export class OrdersModule {}
