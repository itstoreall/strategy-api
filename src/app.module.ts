import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TokensModule } from './tokens/tokens.module';
import { DatabaseModule } from './database/database.module';
import { BinanceService } from './binance/binance.service';
import { LoggerModule } from './logger/logger.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { StrategiesModule } from './strategies/strategies.module';
import { UserModule } from './user/user.module';
// import { UtilsModule } from './utils/utils.module';

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
    UserModule,
    TokensModule,
    OrdersModule,
    StrategiesModule,
    DatabaseModule,
    LoggerModule,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    ThrottlerModule.forRoot([throttlerShort, throttleLong]),
  ],
  controllers: [AppController],
  providers: [AppService, ThrottlerProvider, BinanceService],
})
export class AppModule {}
