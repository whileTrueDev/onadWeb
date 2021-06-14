import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { PublicNotice } from '../../entities/PublicNotice';
import { MarketerInfo } from '../../entities/MarketerInfo';
import { CreatorInfo } from '../../entities/CreatorInfo';

@Module({
  imports: [TypeOrmModule.forFeature([PublicNotice, MarketerInfo, CreatorInfo])],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
