import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AfreecaCategory } from '../../entities/AfreecaCategory';

@Injectable()
export class AfreecaCategoryService {
  constructor(
    @InjectRepository(AfreecaCategory)
    private readonly acRepo: Repository<AfreecaCategory>,
  ) {}

  async getCategories(): Promise<AfreecaCategory[]> {
    return this.acRepo.find();
  }
}
