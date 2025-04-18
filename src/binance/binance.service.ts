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
    try {
      const param = pair ? { symbol: pair } : null;
      const price = await this.client.prices(param);
      // console.log('prices:', price);
      return price;
    } catch (err) {
      console.error('ERROR in getTokenPriceByPair:', err);
      return null;
    }
  }
}
