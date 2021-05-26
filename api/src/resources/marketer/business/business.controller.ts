import { Body, Controller, Get, Put } from '@nestjs/common';
import { MarketerInfo } from '../../../entities/MarketerInfo';
import { BusinessService } from './business.service';
import { UpdateMarketerBusinessInfoDto } from './dto/updateMarketerBusinessInfoDto.dto';

@Controller('marketer/business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  findMarketerBusinessInfo(): Promise<Partial<MarketerInfo>> {
    return this.businessService.findMarketerBusinessInfo('gubgoo');
  }

  @Put()
  updateMarketerBusinessInfo(@Body() dto: UpdateMarketerBusinessInfoDto): Promise<boolean> {
    return this.businessService.updateMarketerBusinessInfo('gubgoo', dto);
  }
}
