import { Injectable, BadRequestException as BadReq } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { StrategyTypeEnum } from '../enum';
import { DatabaseService } from '../database/database.service';
// import { UpdateStrategyDto } from './dto/update-strategy.dto';

@Injectable()
export class StrategiesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(strategyType?: StrategyTypeEnum, extend?: boolean) {
    if (!strategyType) return await this.databaseService.strategy.findMany();

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
          select: {
            ...orderFields,
          },
        },
      },
    };

    const shortToken = {
      select: {
        symbol: true,
      },
    };

    const strategies = await this.databaseService.strategy.findMany({
      where: { type: strategyType },
      select: {
        type: true,
        token: extend ? extendedToken : shortToken,
      },
    });

    const result = strategies.reduce((acc, strategy) => {
      const existingStrategy = acc.find((s) => s.type === strategy.type);
      const tokenParam = extend ? strategy.token : strategy.token.symbol;

      if (existingStrategy) {
        existingStrategy.tokens.push(tokenParam);
      } else {
        acc.push({ type: strategy.type, tokens: [tokenParam] });
      }

      return acc;
    }, []);

    return result;
  }

  /* JSON Content:
  { 
    "type": "BEAR",
    "symbol": "apt",
    "status": "INACTIVE"
  }
  */
  async create(createStrategyDto: CreateStrategyDto) {
    console.log('createStrategyDto:', createStrategyDto);

    const checkParam = { where: { symbol: createStrategyDto.symbol } };
    const token = await this.databaseService.token.findUnique(checkParam);
    if (!token) throw new BadReq('Token not found!');

    const { type, symbol, status } = createStrategyDto;

    const newStrategy: Prisma.StrategyCreateInput = {
      type,
      status,
      token: { connect: { symbol } },
    };

    return await this.databaseService.strategy.create({ data: newStrategy });
  }

  /*
  findOne(id: number) {
    return `This action returns a #${id} strategy`;
  }

  update(id: number, updateStrategyDto: UpdateStrategyDto) {
    return `This action updates a #${id} strategy`;
  }

  remove(id: number) {
    return `This action removes a #${id} strategy`;
  }
  */
}
