import { Injectable, BadRequestException as BadReq } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { TokenStatusEnum } from '../enum';
import { StrategiesService } from '../strategies/strategies.service';
import { DatabaseService } from '../database/database.service';
import { BinanceService } from '../binance/binance.service';

@Injectable()
export class TokensService {
  constructor(
    private readonly db: DatabaseService,
    private readonly binance: BinanceService,
    private readonly strategiesService: StrategiesService,
  ) {}

  async findAll(status?: TokenStatusEnum, orderSymbol?: string) {
    const statusValue = status ? status : TokenStatusEnum.All;
    const ordersParam = { some: { symbol: orderSymbol } };
    const param = {
      where:
        statusValue && orderSymbol
          ? { status: statusValue, orders: ordersParam }
          : orderSymbol
            ? { orders: ordersParam }
            : status
              ? { status: statusValue }
              : {},
    };

    const res = await this.db.token.findMany(param);
    return { status: statusValue, tokens: res };
  }

  async findById(id: number) {
    return await this.db.token.findUnique({ where: { id } });
  }

  async findBySymbol(symbol: string) {
    return await this.db.token.findUnique({ where: { symbol } });
  }

  async create(createTokenDto: CreateTokenDto) {
    const tokenSymbol = createTokenDto.symbol.toUpperCase();
    const tokenName = createTokenDto.name.toLowerCase();

    const createdPair = `${tokenSymbol}USDT`;
    const pairRegex = /^[A-Z]+USDT$/;

    if (
      !pairRegex.test(createdPair) &&
      tokenSymbol !== '1INCH' &&
      tokenSymbol !== '0G' &&
      tokenSymbol !== 'API3' &&
      tokenSymbol !== '2Z' &&
      tokenSymbol !== 'C98'
    )
      throw new BadReq('Invalid pair format!');

    const checkParam = { where: { symbol: tokenSymbol } };
    const token = await this.db.token.findUnique(checkParam);
    if (token) {
      throw new BadReq('Token already exists!');
    }

    try {
      const price = await this.binance.getTokenPriceByPair(createdPair);

      const newToken: Prisma.TokenCreateInput = {
        symbol: tokenSymbol,
        name: tokenName,
        price: +price[createdPair],
        pair: createdPair,
        status: TokenStatusEnum.Init,
      };

      const res = await this.db.token.create({ data: newToken });
      return res;
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async updatePrices() {
    const prices = await this.binance.getTokenPriceByPair();
    const currentTokens = await this.findAll();
    if (prices && currentTokens) {
      const updates = currentTokens.tokens
        .map((token) => {
          const newPrice = +prices[token.pair];
          if (newPrice) {
            return {
              symbol: token.symbol,
              data: { price: newPrice },
            };
          }
          return null;
        })
        .filter(Boolean);

      await Promise.all(
        updates.map((update) =>
          this.db.token.update({
            where: { symbol: update.symbol },
            data: update.data,
          }),
        ),
      );
    } else {
      console.error('Error: fetching Binance prices!');
      return currentTokens;
    }

    return await this.findAll();
  }

  async updateTokenBySymbol(symbol: string, updateTokenDto: UpdateTokenDto) {
    return await this.db.token.update({
      where: { symbol },
      data: updateTokenDto as Prisma.TokenUpdateInput,
    });
  }

  async deleteBySymbol(symbol: string) {
    const strategy = await this.strategiesService.findBySymbol(symbol);
    if (!!strategy) {
      throw new BadReq('There is a Strategy used by!');
    }
    return await this.db.token.delete({ where: { symbol } });
  }
}

/* remove later!!!
async updatePrices() {
  const [prices, currentTokens] = await Promise.all([
    this.binance.getTokenPriceByPair(),
    this.findAll(),
  ]);
  if (prices && currentTokens) {
    console.log('2', prices['BTCUSDT'], currentTokens.tokens.length);

    for (const token of currentTokens.tokens) {
      const newPrice = +prices[token.pair];

      if (newPrice) {
        await this.db.token.update({
          where: { symbol: token.symbol },
          data: { price: newPrice },
        });
      }
    }
  }
  return await this.findAll();
}
*/

/* before adding Prisma --
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTokenDto, StatusEnum } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
// import { StatusEnum } from '../enum';

@Injectable()
export class TokensService {
  private tokens = [
    {
      tokenId: 1,
      symbol: 'btc',
      name: 'bitcoin',
      price: 63000.11,
      status: StatusEnum.Active,
    },
    {
      tokenId: 2,
      symbol: 'eth',
      name: 'ethereum',
      price: 2550.22,
      status: StatusEnum.Pending,
    },
    {
      tokenId: 3,
      symbol: 'sol',
      name: 'solana',
      price: 152.33,
      status: StatusEnum.Init,
    },
    {
      tokenId: 4,
      symbol: 'near',
      name: 'near',
      price: 4.44,
      status: StatusEnum.Active,
    },
  ];

  findAll(status?: StatusEnum) {
    if (status) {
      const tokens = this.tokens.filter((token) => token.status === status);
      if (!tokens.length)
        throw new NotFoundException(`${status} Tokens Not Found!`);
      return tokens;
    } else return this.tokens;
  }

  findById(id: number) {
    const token = this.tokens.find((token) => token.tokenId === id);
    if (!token) throw new NotFoundException('Token Not Found!');
    return { data: token };
  }

  findBySymbol(symbol: string) {
    const token = this.tokens.find((token) => token.symbol === symbol);
    if (!token) throw new NotFoundException('Token Not Found!');
    return { data: token };
  }

  create(createTokenDto: CreateTokenDto) {
    this.tokens.push(createTokenDto);
    return { data: createTokenDto };
  }
  
  

  update(symbol: string, updateTokenDto: UpdateTokenDto) {
    this.tokens = this.tokens.map((token) => {
      if (token.symbol === symbol) {
        return { ...token, ...updateTokenDto };
      } else return token;
    });
    return this.findBySymbol(symbol);
  }

  delete(symbol: string) {
    const removedToken = this.findBySymbol(symbol);
    this.tokens = this.tokens.filter((token) => token.symbol !== symbol);
    return removedToken;
  }
}
*/
