import { Body, Controller, Get, Put } from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerInfo } from '../../../entities/MarketerInfo';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { BusinessService } from './business.service';
import { UpdateMarketerBusinessInfoDto } from './dto/updateMarketerBusinessInfoDto.dto';

@Controller('marketer/business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  findMarketerBusinessInfo(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<Partial<MarketerInfo>> {
    return this.businessService.findMarketerBusinessInfo(marketerId);
  }

  @Put()
  updateMarketerBusinessInfo(
    @Marketer() { marketerId }: MarketerSession,
    @Body() dto: UpdateMarketerBusinessInfoDto,
  ): Promise<boolean> {
    return this.businessService.updateMarketerBusinessInfo(marketerId, dto);
  }
}
