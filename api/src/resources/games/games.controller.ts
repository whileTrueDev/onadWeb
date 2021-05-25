import { Controller, Get, UseGuards } from '@nestjs/common';
import { AfreecaCategory } from '../../entities/AfreecaCategory';
import { IsAuthGuard } from '../auth/guards/isAuth.guard';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  /**
   * 아프리카TV 게임(카테고리) 목록 조회
   */
  @Get()
  @UseGuards(IsAuthGuard)
  getCategories(): Promise<AfreecaCategory[]> {
    return this.gamesService.getCategories();
  }
}
