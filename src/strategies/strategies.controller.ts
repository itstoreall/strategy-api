import { Body, Controller, Get, Ip, Post, Query } from '@nestjs/common';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { StrategyTypeEnum } from '../enum';
import { TokensController } from '../tokens/tokens.controller';
import { StrategiesService } from './strategies.service';
import { LoggerService } from '../logger/logger.service';
// import { UpdateStrategyDto } from './dto/update-strategy.dto';

@Controller('strategies')
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}
  private readonly logger = new LoggerService(TokensController.name);

  @Get()
  findAll(
    @Ip() ip: string,
    @Query('type') strategyType?: StrategyTypeEnum,
    @Query('extend') extend?: boolean,
  ) {
    this.logger.log(`Request for ALL Strategies\t${ip}`, TokensController.name);
    return this.strategiesService.findAll(strategyType, extend);
  }

  @Post()
  create(@Body() createStrategyDto: CreateStrategyDto) {
    return this.strategiesService.create(createStrategyDto);
  }

  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.strategiesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStrategyDto: UpdateStrategyDto,
  ) {
    return this.strategiesService.update(+id, updateStrategyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.strategiesService.remove(+id);
  }
  */
}
