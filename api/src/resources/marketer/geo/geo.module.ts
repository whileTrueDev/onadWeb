import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoService } from './geo.service';
import { GeoController } from './geo.controller';
import { TrackingRepository } from '../../../repositories/Tracking.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TrackingRepository])],
  controllers: [GeoController],
  providers: [GeoService],
})
export class GeoModule {}
