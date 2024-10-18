import { Injectable, BadRequestException as BadReq } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatusEnum, OrderTypeEnum } from '../enum';
import { DatabaseService } from '../database/database.service';
// import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.order.findMany();
  }

  /* JSON Content:
  { 
    "type": "BUY", 
    "symbol": "sol", 
    "price": 162.98, 
    "amount": 1.6 
  }
  */
  async create(createOrderDto: CreateOrderDto) {
    try {
      const checkParam = { where: { symbol: createOrderDto.symbol } };
      const token = await this.databaseService.token.findUnique(checkParam);
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

      return await this.databaseService.order.create({ data: newOrder });
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  /*
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }
  

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
  */
}
