import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [DatabaseModule, UtilsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
