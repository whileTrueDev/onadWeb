import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorsService } from './creators.service';
import { CreatorsController } from './creators.controller';
import { CreatorInfo } from '../../entities/CreatorInfo';
import { CreatorsAnalysisService } from './creators-analysis/creators-analysis.service';
import { CreatorDetail } from '../../entities/CreatorDetail';

@Module({
  imports: [TypeOrmModule.forFeature([CreatorInfo, CreatorDetail])],
  controllers: [CreatorsController],
  providers: [CreatorsService, CreatorsAnalysisService],
})
export class CreatorsModule {}
