import { Controller, Get, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get(':id')
  findOne(@Param('userId') userId: string) {
    return this.sessionsService.findOne(userId);
  }
}
