import { Body, Controller, Get, Patch, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { FindOrdersDto } from './dto/findOrdersDto.dto';
import { UpdateOrderDto } from './dto/updateOrderDto.dto';
import { FindOrdersRes } from './interfaces/findOrdersRes.interface';
import { OrdersService } from './orders.service';

@Controller('marketer/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(IsAuthGuard)
  findOrders(
    @Marketer() { marketerId }: MarketerSession,
    @Query(ValidationPipe) dto: FindOrdersDto,
  ): Promise<FindOrdersRes> {
    return this.ordersService.findOrders(marketerId, dto);
  }

  @Patch()
  @UseGuards(IsAuthGuard)
  async updateOrder(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: UpdateOrderDto,
  ) {
    const result = await this.ordersService.updateOrder(marketerId, dto);
    return result;
  }
}
