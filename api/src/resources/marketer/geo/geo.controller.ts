import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { FindCampaignGeoDataDto } from './dto/findCampaignGeoDataDto.dto';
import { GeoService } from './geo.service';
import { FindCampaignGeoData } from './interfaces/findCampaignGeoDataRes.interface';

@Controller('marketer/geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @UseGuards(IsAuthGuard)
  @Get('campaign')
  findCampaignGeoData(
    @Marketer() { marketerId }: MarketerSession,
    @Query(ValidationPipe) dto: FindCampaignGeoDataDto,
  ): Promise<FindCampaignGeoData[]> {
    return this.geoService.findCampaignGeoData(marketerId, dto.campaignId);
  }
}
