import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerInfo } from '../../entities/MarketerInfo';

@Injectable()
export class MarketerService {
  constructor(
    @InjectRepository(MarketerInfo) private readonly marketerInfoRepo: Repository<MarketerInfo>,
  ) {

  }
  async findOne(marketerId: string): Promise<MarketerInfo> {
    return this.marketerInfoRepo.findOne(marketerId);
  }
}
