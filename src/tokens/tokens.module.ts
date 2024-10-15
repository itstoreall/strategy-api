import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { DatabaseModule } from '../database/database.module';
import { BinanceService } from '../binance/binance.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TokensController],
  providers: [TokensService, BinanceService],
})
export class TokensModule {}

/* befor adding Prisma --
import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
  controllers: [TokensController],
  providers: [TokensService],
})
export class TokensModule {}
*/
