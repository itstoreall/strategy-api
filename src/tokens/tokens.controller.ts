import {
  Ip,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Controller,
  ParseIntPipe,
  UseInterceptors,
  Options,
} from '@nestjs/common';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { TokenStatusEnum } from '../enum';
import { TokensService } from './tokens.service';
import { LoggerService } from '../logger/logger.service';

@Controller('tokens')
@UseInterceptors(ResponseInterceptor)
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}
  private readonly logger = new LoggerService(TokensController.name);

  @Options()
  handleOptions() {
    return {};
  }

  /* /tokens?status=INIT&order_symbol=btc */

  @Get()
  findAll(
    @Ip() ip: string,
    @Query('status') status?: TokenStatusEnum,
    @Query('order_symbol') orderSymbol?: string,
  ) {
    this.logger.log(`Req for ALL Tokens\t${ip}`, TokensController.name);
    return this.tokensService.findAll(status, orderSymbol);
  }

  @Get('id/:id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.tokensService.findById(id);
  }

  @Get(':symbol')
  findBySymbol(@Param('symbol') symbol: string) {
    return this.tokensService.findBySymbol(symbol);
  }

  /* JSON Content:
  {
    "symbol": "btc",
    "name": "bitcoin"
  } 
  */

  @Post()
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokensService.create(createTokenDto);
  }

  @Put('update-prices')
  updatePrices() {
    return this.tokensService.updatePrices();
  }

  @Put(':symbol')
  updateBySymbol(
    @Param('symbol') symbol: string,
    @Body() updateTokenDto: UpdateTokenDto,
  ) {
    return this.tokensService.updateTokenBySymbol(symbol, updateTokenDto);
  }

  @Delete(':symbol')
  deleteBySymbol(@Param('symbol') symbol: string) {
    return this.tokensService.deleteBySymbol(symbol);
  }
}

/* before adding Prisma --
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
*/
