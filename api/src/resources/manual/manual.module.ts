import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManualService } from './manual.service';
import { ManualController } from './manual.controller';
import { Manual } from '../../entities/Manual';

@Module({
  imports: [TypeOrmModule.forFeature([Manual])],
  controllers: [ManualController],
  providers: [ManualService],
})
export class ManualModule {}
