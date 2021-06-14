import { Controller, Get, Query } from '@nestjs/common';
import { AlimtalkService } from './alimtalk.service';
import { MarketerCashBurnAlimtalkDto } from './dto/marketerCashBurnAlimtalkDto.dto';

@Controller('alimtalk')
export class AlimtalkController {
  constructor(private readonly alimtalkService: AlimtalkService) {}

  @Get('marketer/cash/burn')
  marketerCashBurnAlimtalk(@Query() dto: MarketerCashBurnAlimtalkDto): Promise<string> {
    return this.alimtalkService.marketerCashBurnAlimtalk(dto);
  }
}
