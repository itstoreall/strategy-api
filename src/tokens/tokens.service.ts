import { Injectable } from '@nestjs/common';
import { Token, TokenUpdate } from '../types';
import { StatusEnum } from '../enum';

@Injectable()
export class TokensService {
  private tokens = [
    {
      symbol: 'btc',
      name: 'bitcoin',
      price: 63000.11,
      status: StatusEnum.Active,
    },
    {
      symbol: 'eth',
      name: 'ethereum',
      price: 2550.22,
      status: StatusEnum.Pending,
    },
    {
      symbol: 'sol',
      name: 'solana',
      price: 152.33,
      status: StatusEnum.Init,
    },
    {
      symbol: 'near',
      name: 'near',
      price: 4.44,
      status: StatusEnum.Active,
    },
  ];

  findAll(status?: StatusEnum) {
    if (status) {
      return this.tokens.filter((token) => token.status === status);
    } else return this.tokens;
  }

  findOne(symbol: string) {
    const token = this.tokens.find((token) => token.symbol === symbol);
    return { data: token };
  }

  create(token: Token) {
    this.tokens.push(token);
    return { data: token };
  }

  update(symbol: string, tokenUpdate: TokenUpdate) {
    this.tokens = this.tokens.map((token) => {
      if (token.symbol === symbol) {
        return { ...token, ...tokenUpdate };
      } else return token;
    });
    return this.findOne(symbol);
  }

  delete(symbol: string) {
    const removedToken = this.findOne(symbol);
    this.tokens = this.tokens.filter((token) => token.symbol !== symbol);
    return removedToken;
  }
}
