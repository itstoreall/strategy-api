import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokensModule } from './tokens/tokens.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

const throttlerShort = {
  name: 'short',
  ttl: 1000,
  limit: 3,
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
  ],
  controllers: [AppController],
  providers: [AppService, ThrottlerProvider],
})
export class AppModule {}
