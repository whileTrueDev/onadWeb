import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerInfo } from '../../entities/MarketerInfo';

@Injectable()
export class MarketerService {
  constructor(
    @InjectRepository(MarketerInfo) private readonly marketerInfoRepo: Repository<MarketerInfo>,
  ) {}

  async findOne(marketerId: string): Promise<MarketerInfo> {
    return this.marketerInfoRepo.findOne(marketerId);
  }

  async findOneByPlatform(
    marketerId: string,
    platform: 'google' | 'naver' | 'kakao',
  ): Promise<MarketerInfo> {
    let platformId = 0;
    switch (platform) {
      case 'google':
        platformId = 1;
        break;
      case 'naver':
        platformId = 2;
        break;
      case 'kakao':
        platformId = 3;
        break;
      default:
        platformId = 0;
    }
    return this.marketerInfoRepo.findOne(marketerId, { where: { platformType: platformId } });
  }
}
