import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BinanceService } from '../binance/binance.service';
import { StatusEnum } from './dto/create-token.dto';

@Injectable()
export class TokensService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly binanceServise: BinanceService,
  ) {}

  async findAll(status?: StatusEnum) {
    if (status) {
      return this.databaseService.token.findMany({ where: { status } });
    } else return this.databaseService.token.findMany();
  }

  async findById(id: number) {
    return this.databaseService.token.findUnique({ where: { id } });
  }

  async findBySymbol(symbol: string) {
    return this.databaseService.token.findUnique({ where: { symbol } });
  }

  async create(createTokenDto: Prisma.TokenCreateInput) {
    return await this.databaseService.token.create({
      data: createTokenDto,
    });
  }

  async updatePrices() {
    /*
    const [prices, currentTokens] = await Promise.all([
      this.binanceServise.getTokenPriceByPair(),
      this.findAll(),
    ]);

    if (prices && currentTokens) {
      for (const token of currentTokens) {
        const newPrice = +prices[token.pair];

        if (newPrice) {
          await this.databaseService.token.update({
            where: { symbol: token.symbol },
            data: { price: newPrice },
          });
        }
      }
    }
    */

    return await this.findAll();
  }

  async updateToken(symbol: string, updateTokenDto: Prisma.TokenUpdateInput) {
    return await this.databaseService.token.update({
      where: { symbol },
      data: updateTokenDto,
    });
  }

  async delete(symbol: string) {
    return this.databaseService.token.delete({ where: { symbol } });
  }
}

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
