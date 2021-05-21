import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AfreecaCategoryService } from './afreeca-category.service';
import { AfreecaCategoryController } from './afreeca-category.controller';
import { AfreecaCategory } from '../../entities/AfreecaCategory';

@Module({
  imports: [TypeOrmModule.forFeature([AfreecaCategory])],
  controllers: [AfreecaCategoryController],
  providers: [AfreecaCategoryService],
})
export class AfreecaCategoryModule {}
