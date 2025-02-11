import {
  Ip,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
  Controller,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { LoggerService } from '../logger/logger.service';

@Controller('orders')
@UseInterceptors(ResponseInterceptor)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  private readonly logger = new LoggerService(OrdersController.name);

  @Get()
  findAll(@Ip() ip: string) {
    this.logger.log(`Req for ALL Orders\t${ip}`, OrdersController.name);
    return this.ordersService.findAll();
  }

  @Get('id/:id')
  findById(@Param('id', ParseIntPipe) id: string) {
    return this.ordersService.findById(+id);
  }

  @Get('user/:userId')
  findAllByUserId(@Param('userId') userId: string, @Ip() ip: string) {
    console.log('userId ==>', userId);
    this.logger.log(`Req for Orders ${userId}\t${ip}`, OrdersController.name);
    return this.ordersService.findAllByUserId(userId);
  }

  /* JSON Content:
  { 
    "type": "BUY", 
    "symbol": "sol", 
    "price": 162.98, 
    "amount": 1.6 
  }
  */
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Put('id/:id')
  updateOrderById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderById(+id, updateOrderDto);
  }

  @Delete('id/:id')
  removeById(@Param('id', ParseIntPipe) id: string) {
    return this.ordersService.removeById(+id);
  }
}
