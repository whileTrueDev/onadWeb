import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerRegistered } from '../../../entities/BannerRegistered';
import { Campaign } from '../../../entities/Campaign';
import { SlackModule } from '../../slack/slack.module';
import { MarketerModule } from '../marketer.module';
import { BannerController } from './banner/banner.controller';
import { BannerService } from './banner/banner.service';
import { LandingUrlService } from './landing-url/landing-url.service';
import { LandingUrlController } from './landing-url/landing-url.controller';
import { LinkRegistered } from '../../../entities/LinkRegistered';
import { MerchandisesController } from './merchandises/merchandises.controller';
import { MerchandisesService } from './merchandises/merchandises.service';
import { MerchandiseRegistered } from '../../../entities/MerchandiseRegistered';
import { MerchandiseOptions } from '../../../entities/MerchandiseOptions';
import { MerchandisePickupAddresses } from '../../../entities/MerchandisePickupAddresses';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BannerRegistered,
      Campaign,
      LinkRegistered,
      MerchandiseRegistered,
      MerchandiseOptions,
      MerchandisePickupAddresses,
    ]),
    forwardRef(() => MarketerModule),
    SlackModule,
  ],
  controllers: [BannerController, LandingUrlController, MerchandisesController],
  providers: [BannerService, LandingUrlService, MerchandisesService],
})
export class InventoryModule {}
