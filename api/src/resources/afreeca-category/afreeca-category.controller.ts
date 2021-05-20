import { Controller, Get, UseGuards } from '@nestjs/common';
import { AfreecaCategory } from '../../entities/AfreecaCategory';
import { LocalAuthGuard } from '../auth/guards/local.guard';
import { AfreecaCategoryService } from './afreeca-category.service';

@Controller('afreeca-category')
export class AfreecaCategoryController {
  constructor(private readonly afreecaCategoryService: AfreecaCategoryService) {}

  @Get()
  @UseGuards(LocalAuthGuard)
  getCategories(): Promise<AfreecaCategory[]> {
    return this.afreecaCategoryService.getCategories();
  }
}
