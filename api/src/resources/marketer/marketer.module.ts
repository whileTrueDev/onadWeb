import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketerService } from './marketer.service';
import { MarketerController } from './marketer.controller';
import { MarketerInfo } from '../../entities/MarketerInfo';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([MarketerInfo]), MailModule],
  controllers: [MarketerController],
  providers: [MarketerService],
  exports: [MarketerService],
})
export class MarketerModule {}
