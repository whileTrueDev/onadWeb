import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketerService } from './marketer.service';
import { MarketerController } from './marketer.controller';
import { MarketerInfo } from '../../entities/MarketerInfo';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketerInfo]),
  ],
  controllers: [MarketerController],
  providers: [MarketerService],
  exports: [MarketerService]
})
export class MarketerModule {}
