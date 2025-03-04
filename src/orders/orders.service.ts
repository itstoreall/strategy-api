import { Injectable, BadRequestException as BadReq } from '@nestjs/common';
import { Exchange, OrderStatus, OrderType, Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { StrategiesService } from '../strategies/strategies.service';
import { DatabaseService } from '../database/database.service';
import {
  OrderStatusEnum,
  OrderTypeEnum,
  StrategyStatusEnum,
  StrategyTypeEnum,
} from '../enum';

@Injectable()
export class OrdersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly strategiesService: StrategiesService,
  ) {}

  async findAll() {
    return await this.db.order.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findAllByUserId(userId: string) {
    try {
      const userOrders = await this.db.order.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });

      // if (!userOrders.length) {
      //   throw new BadReq(`No orders found for userId: ${userId}`);
      // }

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
      // console.log('=>>>>>', userId, type, symbol, status, exchange);
      const userOrders = await this.db.order.findMany({
        where: { userId, type, symbol, status, exchange },
        orderBy: { updatedAt: 'desc' },
      });

      // console.log('userOrders:', userOrders);

      return userOrders;
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async findById(id: number) {
    return await this.db.order.findUnique({ where: { id } });
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

      const strategyType =
        createOrderDto.type === OrderTypeEnum.Buy
          ? StrategyTypeEnum.Bull
          : StrategyTypeEnum.Bear;

      await this.strategiesService.create({
        type: strategyType,
        status: StrategyStatusEnum.Active,
        symbol: createOrderDto.symbol,
        userId: createOrderDto.userId,
        data: { value: 0, is: true },
      });

      const newOrder: Prisma.OrderCreateInput = {
        type: createOrderDto.type,
        amount,
        price,
        fiat,
        status: OrderStatusEnum.Active,
        token: { connect: { symbol: createOrderDto.symbol } },
        exchange,
        userId: createOrderDto.userId,
      };

      return await this.db.order.create({ data: newOrder });
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

        const strategy = await this.strategiesService.findByTypeAndSymbol(
          strategyType,
          deletedOrder.symbol,
        );

        if (strategy) {
          await this.strategiesService.deleteById(strategy.id);
          console.log(`Deleted strategy with ID: ${strategy.id}`);
        }
      }

      return deletedOrder;
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  // async removeById(id: number) {
  //   try {
  //     const deletedOrder = await this.db.order.delete({ where: { id } });

  //     const remainingOrders = await this.db.order.findMany({
  //       where: {
  //         symbol: deletedOrder.symbol,
  //         type: deletedOrder.type,
  //         userId: deletedOrder.userId,
  //       },
  //     });

  //     if (deletedOrder.id === id) {
  //       console.log('res:', deletedOrder.id === id);
  //       // const strategy = await this.strategiesService.findByTypeAndSymbol(
  //       //   deletedOrder.type as OrderTypeEnum,
  //       //   deletedOrder.symbol,
  //       // );

  //       const strategyType =
  //         deletedOrder.type === OrderTypeEnum.Buy
  //           ? StrategyTypeEnum.Bull
  //           : StrategyTypeEnum.Bear;

  //       const strategy = await this.strategiesService.findByTypeAndSymbol(
  //         strategyType,
  //         deletedOrder.symbol,
  //       );

  //       console.log('strategyType:', strategyType);

  //       if (strategy) {
  //         await this.strategiesService.deleteById(strategy.id);
  //         console.log(`Deleted strategy with ID: ${strategy.id}`);
  //       }
  //     }
  //     return deletedOrder;

  //     // if (res.id === id) {
  //     //   console.log('res:', res.id === id);
  //     //   const strategy = await this.strategiesService.findByTypeAndSymbol(
  //     //     res.type as OrderTypeEnum,
  //     //     res.symbol,
  //     //   );
  //     //   console.log('strategy:', strategy);
  //     // }
  //     // return res;
  //   } catch (err) {
  //     throw new BadReq(err.message);
  //   }
  // }
}
