import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerInfo } from '../../../entities/MarketerInfo';
import { UpdateMarketerBusinessInfoDto } from './dto/updateMarketerBusinessInfoDto.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(MarketerInfo) private readonly marketerInfoRepo: Repository<MarketerInfo>,
  ) {}

  async findMarketerBusinessInfo(
    marketerId: string,
  ): Promise<Pick<MarketerInfo, 'marketerBusinessRegNum' | 'marketerBusinessRegSrc'>> {
    const user = await this.marketerInfoRepo.findOne({
      where: { marketerId },
      select: ['marketerBusinessRegNum', 'marketerBusinessRegSrc'],
    });
    return user;
  }

  async updateMarketerBusinessInfo(
    marketerId: string,
    dto: UpdateMarketerBusinessInfoDto,
  ): Promise<boolean> {
    const result = await this.marketerInfoRepo
      .createQueryBuilder()
      .update()
      .set({ marketerBusinessRegSrc: dto.value })
      .where('marketerId = :marketerId', { marketerId })
      .execute();

    if (result.affected > 0) return true;
    return false;
  }
}
