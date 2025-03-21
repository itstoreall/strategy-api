import { Module } from '@nestjs/common';
import { SessionsModule } from '../sessions/sessions.module';
import { DatabaseModule } from '../database/database.module';
import { MailerModule } from '../mailer/mailer.module';
import { UtilsModule } from '../utils/utils.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, UtilsModule, MailerModule, SessionsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
