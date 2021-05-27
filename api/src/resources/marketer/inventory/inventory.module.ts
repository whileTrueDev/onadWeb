import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerRegistered } from '../../../entities/BannerRegistered';
import { Campaign } from '../../../entities/Campaign';
import { SlackModule } from '../../slack/slack.module';
import { MarketerModule } from '../marketer.module';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BannerRegistered, Campaign]),
    forwardRef(() => MarketerModule),
    SlackModule,
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class InventoryModule {}
