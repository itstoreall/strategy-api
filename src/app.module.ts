import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TokensModule } from './tokens/tokens.module';
import { DatabaseModule } from './database/database.module';
import { BinanceService } from './binance/binance.service';
import { LoggerModule } from './logger/logger.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const throttlerShort = {
  name: 'short',
  ttl: 1000,
  limit: 5,
};

const throttleLong = {
  name: 'long',
  ttl: 60000,
  limit: 60,
};

const ThrottlerProvider = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
};

@Module({
  imports: [
    TokensModule,
    DatabaseModule,
    ThrottlerModule.forRoot([throttlerShort, throttleLong]),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, ThrottlerProvider, BinanceService],
})
export class AppModule {}
