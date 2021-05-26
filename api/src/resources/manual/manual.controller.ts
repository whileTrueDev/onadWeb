import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ManualService } from './manual.service';
import { FindManualDto } from './dto/findManualDto.dto';
import { Manual } from '../../entities/Manual';

@Controller('manual')
export class ManualController {
  constructor(private readonly manualService: ManualService) {}

  @Get()
  findManual(@Query(ValidationPipe) dto: FindManualDto): Promise<Manual[]> {
    return this.manualService.findManual(dto);
  }
}
