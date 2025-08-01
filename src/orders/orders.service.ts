import { Injectable, BadRequestException as BadReq } from '@nestjs/common';
import { Exchange, OrderStatus, OrderType, Prisma } from '@prisma/client';
// import * as bcrypt from 'bcrypt';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { StrategiesService } from '../strategies/strategies.service';
// import { SessionsService } from '../sessions/sessions.service';
import { DatabaseService } from '../database/database.service';
import {
  OrderStatusEnum,
  OrderTypeEnum,
  StrategyStatusEnum,
  StrategyTypeEnum,
  // AuthRoleEnum,
} from '../enum';

@Injectable()
export class OrdersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly strategiesService: StrategiesService,
    // private readonly sessionsService: SessionsService,
  ) {}

  /*
  async findAll() {
    return await this.db.order.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }
  */

  async findById(id: number) {
    return await this.db.order.findUnique({ where: { id } });
  }

  async findAllByUserId(userId: string) {
    /*
    console.log('userId:::', userId);
    console.log('sessionToken:::', sessionToken);
    */

    /*
    const session = await this.sessionsService.findByUserId(userId);
    if (!session) {
      throw new BadReq('ERROR: no session!');
    }

    const isEqual = await bcrypt.compare(session.sessionToken, sessionToken);
    if (!isEqual) {
      const admin = await this.db.user.findFirst({
        where: { role: AuthRoleEnum.Admin },
      });
      if (!admin) throw new BadReq('ERROR: user is not an Admin!');
      const session = await this.sessionsService.findByUserId(admin.id);
      if (!session) throw new BadReq('ERROR: no Admin session!');
      const isEqual = await bcrypt.compare(session.sessionToken, sessionToken);
      if (!isEqual) throw new BadReq('ERROR: failed Admin sessionTokens!');
    }
    */

    try {
      const userOrders = await this.db.order.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });
      return userOrders;
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async findAllByUserIdAndStrategy(
    userId: string,
    type: OrderType,
    symbol: string = '',
    status: OrderStatus,
    exchange: Exchange,
  ) {
    try {
      const userOrders = await this.db.order.findMany({
        where: { userId, type, symbol, status, exchange },
        orderBy: { updatedAt: 'desc' },
      });

      const currentType =
        type === OrderTypeEnum.Buy
          ? StrategyTypeEnum.Bull
          : StrategyTypeEnum.Bear;

      const strategy = await this.strategiesService.findByTypeSymbolAndUserId(
        currentType,
        symbol,
        userId,
      );

      return { orders: userOrders, strategy };
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const checkParam = { where: { id: createOrderDto.userId } };
      const userData = await this.db.user.findUnique(checkParam);

      const { amount, price, exchange } = createOrderDto;
      const fiat = amount * price;

      if (createOrderDto.userId !== userData.id) {
        throw new BadReq('UserId do not match');
      }

      const isBullStrategy = createOrderDto.type === OrderTypeEnum.Buy;

      let strategy = null;
      if (isBullStrategy) {
        const strategyType = isBullStrategy
          ? StrategyTypeEnum.Bull
          : StrategyTypeEnum.Bear;
        // const data = JSON.stringify({});
        strategy = await this.strategiesService.create({
          type: strategyType,
          status: StrategyStatusEnum.Active,
          symbol: createOrderDto.symbol,
          userId: createOrderDto.userId,
          data: null,
        });
      }

      const newOrder: Prisma.OrderCreateInput = {
        type: createOrderDto.type,
        amount: isBullStrategy ? amount : 0,
        price,
        fiat: isBullStrategy ? +fiat.toFixed(2) : 0,
        status: OrderStatusEnum.Active,
        token: { connect: { symbol: createOrderDto.symbol } },
        exchange,
        userId: createOrderDto.userId,
      };

      const createdOrder = await this.db.order.create({ data: newOrder });
      return isBullStrategy
        ? { ...createdOrder, target: strategy.target }
        : createdOrder;
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async updateOrderById(id: number, updateTokenDto: UpdateOrderDto) {
    return await this.db.order.update({
      where: { id },
      data: updateTokenDto as Prisma.OrderUpdateInput,
    });
  }

  async removeById(id: number) {
    try {
      const deletedOrder = await this.db.order.delete({ where: { id } });

      /*
      const remainingOrders = await this.db.order.findMany({
        where: {
          symbol: deletedOrder.symbol,
          type: deletedOrder.type,
          userId: deletedOrder.userId,
        },
      });
      
      if (remainingOrders.length === 0) {
        const strategyType =
          deletedOrder.type === OrderTypeEnum.Buy
            ? StrategyTypeEnum.Bull
            : StrategyTypeEnum.Bear;

        const strategy = await this.strategiesService.findByTypeSymbolAndUserId(
          strategyType,
          deletedOrder.symbol,
          deletedOrder.userId,
        );

        if (strategy) {
          await this.strategiesService.deleteById(strategy.id);
          console.log(`Deleted strategy with ID: ${strategy.id}`);
        }
      }
      */

      return deletedOrder;
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async deleteManyByIds(orderIds: number[]) {
    // console.log(2, orderIds);
    try {
      if (!orderIds.length) throw new BadReq('Order IDs are required');
      const deleted = await this.db.order.deleteMany({
        where: { id: { in: orderIds } },
      });
      // console.log(3, deleted);
      return {
        deletedCount: deleted.count,
        deletedIds: orderIds,
      };
    } catch (err) {
      throw new BadReq(err.message);
    }
  }
}
