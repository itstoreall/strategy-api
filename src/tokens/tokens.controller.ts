import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTokenDto, StatusEnum } from './dto/create-token.dto';
import { TokensService } from './tokens.service';
import { LoggerService } from '../logger/logger.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}
  private readonly logger = new LoggerService(TokensController.name);

  @Get() // /tokens?status=INIT
  async findAll(@Ip() ip: string, @Query('status') status?: StatusEnum) {
    this.logger.log(`Request for ALL Tokens\t${ip}`, TokensController.name);
    const statusValue = status ? status : StatusEnum.All;
    const tokens = await this.tokensService.findAll(status);
    return { data: { status: statusValue, tokens } };
  }

  @Get('id/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const token = await this.tokensService.findById(id);
    return { data: token };
  }

  @Get(':symbol')
  async findOne(@Param('symbol') symbol: string) {
    const token = await this.tokensService.findBySymbol(symbol);
    return { data: token };
  }

  @Post()
  async create(@Body() createTokenDto: CreateTokenDto) {
    const pairRegex = /^[A-Z]+USDT$/;
    if (!pairRegex.test(createTokenDto.pair))
      throw new BadRequestException('Invalid pair format!');
    const createdToken = await this.tokensService.create(createTokenDto);
    return { data: createdToken };
  }

  @Put('update')
  async updatePrices() {
    const updatedTokens = await this.tokensService.updatePrices();
    return { data: updatedTokens };
  }

  @Put(':symbol')
  async update(
    @Param('symbol') symbol: string,
    @Body() updateTokenDto: Prisma.TokenUpdateInput,
  ) {
    const updatedToken = await this.tokensService.updateToken(
      symbol,
      updateTokenDto,
    );
    return { data: updatedToken };
  }

  @Delete(':symbol')
  async delete(@Param('symbol') symbol: string) {
    const deletedToken = await this.tokensService.delete(symbol);
    return { data: deletedToken };
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
