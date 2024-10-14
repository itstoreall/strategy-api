import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokensModule } from './tokens/tokens.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [TokensModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
