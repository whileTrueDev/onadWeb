import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manual } from '../../entities/Manual';
import { FindManualDto } from './dto/findManualDto.dto';

@Injectable()
export class ManualService {
  constructor(@InjectRepository(Manual) private readonly manualRepo: Repository<Manual>) {}

  public async findManual(dto: FindManualDto): Promise<Manual[]> {
    return this.manualRepo.find({
      where: { type: dto.type },
      order: { priority: 'ASC', title: 'ASC' },
    });
  }
}
