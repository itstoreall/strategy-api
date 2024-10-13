import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenDto, StatusEnum } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get() // /tokens?status=INIT
  findAll(@Query('status') status: StatusEnum) {
    const statusValue = status ? status : StatusEnum.All;
    const tokens = this.tokensService.findAll(status);
    return { data: { status: statusValue, tokens } };
  }

  @Get('id/:id')
  findById(@Param('id', ParseIntPipe) id: number) {
    const token = this.tokensService.findById(id);
    return { data: token };
  }

  @Get(':symbol')
  findOne(@Param('symbol') symbol: string) {
    const token = this.tokensService.findBySymbol(symbol);
    return { data: token };
  }

  @Post()
  create(@Body(ValidationPipe) createTokenDto: CreateTokenDto) {
    const createdToken = this.tokensService.create(createTokenDto);
    return { data: createdToken };
  }

  @Put(':symbol')
  update(
    @Param('symbol') symbol: string,
    @Body(ValidationPipe) updateTokenDto: UpdateTokenDto,
  ) {
    const updatedToken = this.tokensService.update(symbol, updateTokenDto);
    return { data: updatedToken };
  }

  @Delete(':symbol')
  delete(@Param('symbol') symbol: string) {
    const deletedToken = this.tokensService.delete(symbol);
    return { data: deletedToken };
  }
}
