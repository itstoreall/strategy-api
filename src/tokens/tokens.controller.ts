import { Controller, Get, Param } from '@nestjs/common';

@Controller('tokens')
export class TokensController {
  @Get()
  findAll() {
    return [1, 2, 3];
  }

  @Get(':symbol')
  findOne(@Param('symbol') symbol: string) {
    return { symbol };
  }
}
