import {
  Ip,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Controller,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { StrategyTypeEnum } from '../enum';
import { StrategiesService } from './strategies.service';
import { LoggerService } from '../logger/logger.service';
import { UpdateStrategyDto } from './dto/update-strategy.dto';

@Controller('strategies')
@UseInterceptors(ResponseInterceptor)
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}
  private readonly logger = new LoggerService(StrategiesController.name);

  @Get()
  findAll(
    @Ip() ip: string,
    @Query('type') strategyType?: StrategyTypeEnum,
    @Query('extend') extend?: boolean,
  ) {
    this.logger.log(`Req for ALL Strategies\t${ip}`, StrategiesController.name);
    return this.strategiesService.findAll(strategyType, extend);
  }

  @Get('id/:id')
  findById(@Param('id', ParseIntPipe) id: string) {
    return this.strategiesService.findById(+id);
  }

  @Post()
  create(@Body() createStrategyDto: CreateStrategyDto) {
    return this.strategiesService.create(createStrategyDto);
  }

  @Put('update-strategy-data')
  updateById(
    // @Param('id', ParseIntPipe) id: string,
    @Body() body: UpdateStrategyDto,
  ) {
    return this.strategiesService.updateStrategyById(body);
  }

  // @Put('id/:id')
  // updateById(
  //   @Param('id', ParseIntPipe) id: string,
  //   @Body() strategyData: string,
  // ) {
  //   // console.log('strategyData:', strategyData);
  //   return strategyData ? this.strategiesService.updateStrategyById(+id) : null;
  // }

  // @Put('update-strategy-data')
  // updateById(@Body() body: UpdateStrategyDto) {
  //   console.log('body:', body);
  //   // return this.userService.updateName(body.strategyId, body.name);
  //   return this.strategiesService.updateStrategyById(body.strategyId, body);
  // }

  @Delete('id/:id')
  deleteById(@Param('id') id: string) {
    return this.strategiesService.deleteById(+id);
  }
}
