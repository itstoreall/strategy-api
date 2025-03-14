import { Injectable } from '@nestjs/common';
import Binance from 'binance-api-node';

type PriceRes = { [key: string]: string };

@Injectable()
export class BinanceService {
  private readonly client = Binance();

  async getAllTokens() {
    const prices = await this.client.prices();
    return prices;
  }

  async getTokenPriceByPair(pair?: string): Promise<PriceRes> {
    const param = pair ? { symbol: pair } : null;
    const price = await this.client.prices(param);
    // console.log('price:', price);
    return price;
  }
}
