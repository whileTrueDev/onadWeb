import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerInfo } from '../../entities/MarketerInfo';
import encrypto from '../../utils/encryption';

@Injectable()
export class MarketerService {
  constructor(
    @InjectRepository(MarketerInfo) private readonly marketerInfoRepo: Repository<MarketerInfo>,
  ) {}

  async findOne(marketerId: string): Promise<MarketerInfo> {
    return this.marketerInfoRepo.findOne({ where: { marketerId } });
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

  /**
   * 특정 광고주 임시 비밀번호 설정
   */
  async setTemporaryPassword(marketerId: string, tempPw: string): Promise<boolean> {
    const [key, salt] = encrypto.make(tempPw);
    const result = await this.marketerInfoRepo
      .createQueryBuilder()
      .update()
      .set({ marketerSalt: salt, marketerPasswd: key, temporaryLogin: 1 })
      .where('marketerId = :marketerId', { marketerId })
      .execute();
    if (result.affected > 0) return true;
    return false;
  }
}
