import { Injectable, BadRequestException as BadReq } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatusEnum, OrderTypeEnum } from '../enum';
import { DatabaseService } from '../database/database.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly db: DatabaseService) {}

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

      console.log('userOrders:', userOrders);

      return userOrders;
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async findById(id: number) {
    return await this.db.order.findUnique({ where: { id } });
  }

  async create(createOrderDto: CreateOrderDto) {
    console.log('serv createOrderDto:', createOrderDto);
    try {
      const checkParam = { where: { id: createOrderDto.userId } };
      const userData = await this.db.user.findUnique(checkParam);

      const { amount, price } = createOrderDto;
      const fiat = amount * price;

      if (createOrderDto.userId !== userData.id) {
        throw new BadReq('UserId do not match');
      }

      const newOrder: Prisma.OrderCreateInput = {
        type: OrderTypeEnum.Buy,
        amount,
        price,
        fiat,
        status: OrderStatusEnum.Active,
        token: { connect: { symbol: createOrderDto.symbol } },
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
    return await this.db.order.delete({ where: { id } });
  }
}
