import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { MarketerInfo } from '../../../entities/MarketerInfo';

@Module({
  imports: [TypeOrmModule.forFeature([MarketerInfo])],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
