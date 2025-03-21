import { Controller, Get, Ip, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { LoggerService } from '../logger/logger.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}
  private readonly logger = new LoggerService(SessionsController.name);

  @Get('/all')
  getAllSessions(
    @Query('userId') userId: string,
    @Query('sessionToken') sessionToken: string,
    @Ip() ip: string,
  ) {
    this.logger.log(
      `Req for Session ${userId}\t${ip}`,
      SessionsController.name,
    );
    return this.sessionsService.getAllSessions(userId, sessionToken);
  }

  /*
  @Get(':id')
  findOne(
    @Param('userId') userId: string,
    @Query('sessionToken') sessionToken: string,
    @Ip() ip: string,
  ) {
    this.logger.log(
      `Req for Session ${userId}\t${ip}`,
      SessionsController.name,
    );
    return this.sessionsService.findByUserId(userId);
  }
  */
}
