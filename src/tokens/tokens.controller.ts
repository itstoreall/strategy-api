import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StatusEnum } from 'src/enum';

@Controller('tokens') //?status=INIT
export class TokensController {
  @Get()
  findAll(@Query('status') status: StatusEnum) {
    const statusValue = status ? status : StatusEnum.All;
    return { status: statusValue, data: [1, 2, 3] };
  }

  @Get(':symbol')
  findOne(@Param('symbol') symbol: string) {
    return { symbol };
  }

  @Post()
  create(@Body() token: {}) {
    return token;
  }

  @Patch(':symbol')
  update(@Param('symbol') symbol: string, @Body() tokenUpdate: {}) {
    console.log('tokenUpdate:', symbol, tokenUpdate);
    return { ...tokenUpdate };
  }

  @Delete(':symbol')
  delete(@Param('symbol') symbol: string) {
    return { symbol };
  }
}
