import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerInfo } from '../../../entities/MarketerInfo';

@Injectable()
export class ProfileImageService {
  constructor(
    @InjectRepository(MarketerInfo) private readonly marketerInfoRepo: Repository<MarketerInfo>,
  ) {}

  readProfileImage(marketerId: string): Promise<Pick<MarketerInfo, 'profileImage' | 'marketerId'>> {
    return this.marketerInfoRepo.findOne({
      where: { marketerId },
      select: ['profileImage', 'marketerId'],
    });
  }

  async createOrUpdateProfileImage(marketerId: string, profileImage: string): Promise<boolean> {
    const result = await this.marketerInfoRepo
      .createQueryBuilder()
      .update()
      .set({ profileImage })
      .where('marketerId = :marketerId', { marketerId })
      .execute();

    if (result.affected > 0) return true;
    return false;
  }

  async deleteProfileImage(marketerId: string): Promise<boolean> {
    const result = await this.marketerInfoRepo
      .createQueryBuilder()
      .update()
      .set({ profileImage: null })
      .where('marketerId = :marketerId', { marketerId })
      .execute();

    if (result.affected > 0) return true;
    return false;
  }
}
