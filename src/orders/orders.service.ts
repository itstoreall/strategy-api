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

  async create(createOrderDto: CreateOrderDto) {
    try {
      const checkParam = { where: { symbol: createOrderDto.symbol } };
      const token = await this.db.token.findUnique(checkParam);
      if (!token) throw new BadReq('Token not found!');

      const { amount, price } = createOrderDto;
      const fiat = amount * price;

      const newOrder: Prisma.OrderCreateInput = {
        type: OrderTypeEnum.Buy,
        amount,
        price,
        fiat,
        status: OrderStatusEnum.Active,
        token: { connect: { symbol: token.symbol } },
      };

      return await this.db.order.create({ data: newOrder });
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async findById(id: number) {
    return await this.db.order.findUnique({ where: { id } });
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
