import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { OrdersController } from './orders.controller';
import { BinanceService } from '../binance/binance.service';
import { OrdersService } from './orders.service';
import { StrategiesModule } from '../strategies/strategies.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [DatabaseModule, StrategiesModule, SessionsModule],
  controllers: [OrdersController],
  providers: [OrdersService, BinanceService],
})
export class OrdersModule {}
