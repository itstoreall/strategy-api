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
