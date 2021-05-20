import { Controller } from '@nestjs/common';
import { MarketerService } from './marketer.service';

@Controller('marketer')
export class MarketerController {
  constructor(private readonly marketerService: MarketerService) {}
}
