import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { CreatorInquiry } from '../../entities/CreatorInquiry';
import { MarketerInquiry } from '../../entities/MarketerInquiry';

@Module({
  imports: [TypeOrmModule.forFeature([CreatorInquiry, MarketerInquiry])],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
