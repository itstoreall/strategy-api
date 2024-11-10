import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { UtilsModule } from '../utils/utils.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, UtilsModule, MailerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
