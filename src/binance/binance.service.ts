import { Injectable } from '@nestjs/common';
import Binance from 'binance-api-node';

type PriceRes = { [key: string]: string };

@Injectable()
export class BinanceService {
  private readonly client = Binance();

  async getTokenPriceByPair(pair?: string): Promise<PriceRes> {
    const param = pair ? { symbol: pair } : null;
    const price = await this.client.prices(param);
    return price;
  }
}
