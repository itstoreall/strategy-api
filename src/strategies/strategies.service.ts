import { Injectable, BadRequestException as BadReq } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { StrategyTypeEnum } from '../enum';
import { DatabaseService } from '../database/database.service';
import { UpdateStrategyDto } from './dto/update-strategy.dto';
// import { UpdateStrategyDto } from './dto/update-strategy.dto';

@Injectable()
export class StrategiesService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(strategyType?: StrategyTypeEnum, extend?: boolean) {
    if (!strategyType)
      return await this.db.strategy.findMany({
        orderBy: { updatedAt: 'desc' },
      });

    const tokenFields = {
      id: extend ? true : false,
      symbol: extend ? true : true,
      price: extend ? true : false,
      status: extend ? true : false,
      updatedAt: extend ? true : false,
    };

    const orderFields = {
      id: true,
      amount: true,
      price: true,
      fiat: true,
      status: true,
      updatedAt: true,
    };

    const extendedToken = {
      select: {
        ...tokenFields,
        orders: {
          select: { ...orderFields },
          orderBy: { updatedAt: 'desc' },
        },
      },
    };

    const shortToken = { select: { symbol: true } };

    const strategies = await this.db.strategy.findMany({
      where: { type: strategyType },
      select: {
        type: true,
        token: extend ? extendedToken : shortToken,
      },
    });

    const res = strategies.reduce((acc, strategy) => {
      const existingStrategy = acc.find((s) => s.type === strategy.type);
      const tokenParam = extend ? strategy.token : strategy.token.symbol;

      if (existingStrategy) {
        existingStrategy.tokens.push(tokenParam);
      } else {
        acc.push({ type: strategy.type, tokens: [tokenParam] });
      }

      return acc;
    }, []);

    return res;
  }

  async findById(id: number) {
    return await this.db.strategy.findUnique({ where: { id } });
  }

  async findByTypeAndSymbol(type: StrategyTypeEnum, symbol: string) {
    // const _type =
    //   type === OrderTypeEnum.Buy
    //     ? StrategyTypeEnum.Bull
    //     : StrategyTypeEnum.Bear;
    return await this.db.strategy.findFirst({
      where: { type: type, symbol },
    });
  }

  async findByTypeSymbolAndUserId(
    type: StrategyTypeEnum,
    symbol: string,
    userId: string,
  ) {
    return await this.db.strategy.findFirst({
      where: { type: type, symbol, userId },
    });
  }

  /* JSON Content:
  { 
    "type": "BULL",
    "symbol": "apt",
    "status": "INACTIVE",
    "userId": "dwedwedwedwedwed"
  }
  */
  async create(createStrategyDto: CreateStrategyDto) {
    const { type, symbol, status, userId } = createStrategyDto; // data is here!
    const symbolUpperCase = symbol.toUpperCase();
    const checkParam = { where: { symbol: symbolUpperCase } };
    const token = await this.db.token.findUnique(checkParam);

    if (!token) throw new BadReq('Token not found!');

    const existingStrategy = await this.db.strategy.findFirst({
      where: { type, token: { symbol: symbolUpperCase }, userId },
    });

    console.log('existingStrategy:', existingStrategy);

    if (existingStrategy) {
      const errorMsg = `strategy ${type} ${symbolUpperCase} already exists`;
      console.error(errorMsg);
      return existingStrategy;
    }

    const newStrategy: Prisma.StrategyCreateInput = {
      type,
      status,
      token: { connect: { symbol: symbolUpperCase } },
      userId,
      /*
      data, // from the createStrategyDto
      */
    };

    // console.log('newStrategy:', newStrategy);

    return await this.db.strategy.create({ data: newStrategy });
  }

  async updateStrategyById(id: number, updateStrategyDto: UpdateStrategyDto) {
    return await this.db.strategy.update({
      where: { id },
      data: updateStrategyDto as Prisma.StrategyUpdateInput,
    });
  }

  async deleteById(id: number) {
    return await this.db.strategy.delete({ where: { id } });
  }

  /*

  */
}
