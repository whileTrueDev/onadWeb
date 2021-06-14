import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import geoip from 'geoip-lite';
import { TrackingRepository } from '../../../repositories/Tracking.repository';
import { FindCampaignGeoData } from './interfaces/findCampaignGeoDataRes.interface';

@Injectable()
export class GeoService {
  constructor(
    @InjectRepository(TrackingRepository) private readonly trackingRepo: TrackingRepository,
  ) {}

  // * 캠페인별 클릭 위치 IP -> 위치(Geo) 데이터
  public async findCampaignGeoData(
    marketerId: string,
    campaignId: string,
  ): Promise<FindCampaignGeoData[]> {
    const data = await this.trackingRepo.find({ where: { campaignId, marketerId } });

    const result: FindCampaignGeoData[] = [];
    data.forEach(click => {
      if (click.ip) {
        const geo = this.ipToGeo(click.ip);
        if (geo) result.push(geo);
      }
    });

    return result;
  }

  // * ip -> geo data
  private ipToGeo(ip: string): FindCampaignGeoData {
    const result = geoip.lookup(ip);

    if (!result) return null;

    const [latitude, longitude] = result.ll;
    return { ...result, latitude, longitude };
  }
}
