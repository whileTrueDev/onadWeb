import { Body, Controller, Post } from '@nestjs/common';
import { CreatorInquiry } from '../../entities/CreatorInquiry';
import { MarketerInquiry } from '../../entities/MarketerInquiry';
import { CreatorInquiryDto } from './dto/creatorInquiryDto.dto';
import { MarketerInquiryDto } from './dto/marketerInquiryDto.dto';
import { InquiryService } from './inquiry.service';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  createMarketerInquiry(@Body() dto: MarketerInquiryDto): Promise<MarketerInquiry> {
    return this.inquiryService.createMarketerInquiry(dto);
  }

  @Post('/creator')
  createCreatorInquiry(@Body() dto: CreatorInquiryDto): Promise<CreatorInquiry> {
    return this.inquiryService.createCreatorInquiry(dto);
  }
}
