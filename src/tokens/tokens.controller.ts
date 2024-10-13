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
import { TokensService } from './tokens.service';
import { Token, TokenUpdate } from '../types';
import { StatusEnum } from '../enum';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get() // /tokens?status=INIT
  findAll(@Query('status') status: StatusEnum) {
    const statusValue = status ? status : StatusEnum.All;
    const tokens = this.tokensService.findAll(status);
    return { data: { status: statusValue, tokens } };
  }

  @Get(':symbol')
  findOne(@Param('symbol') symbol: string) {
    console.log('symbol:', symbol);
    const token = this.tokensService.findOne(symbol);
    return { data: token };
  }

  @Post()
  create(@Body() token: Token) {
    const createdToken = this.tokensService.create(token);
    return { data: createdToken };
  }

  @Patch(':symbol')
  update(@Param('symbol') symbol: string, @Body() tokenUpdate: TokenUpdate) {
    const updatedToken = this.tokensService.update(symbol, tokenUpdate);
    return { data: updatedToken };
  }

  @Delete(':symbol')
  delete(@Param('symbol') symbol: string) {
    const deletedToken = this.tokensService.delete(symbol);
    return { data: deletedToken };
  }
}
