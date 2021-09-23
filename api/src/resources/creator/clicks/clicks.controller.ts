import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { Creator } from '../../../decorators/sessionData.decorator';
import { PaginationDto } from '../../../dto/paginationDto.dto';
import { CampaignLog } from '../../../entities/CampaignLog';
import { CreatorSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { ClicksService } from './clicks.service';
import { FindCurrentClicksRes } from './interfaces/FindCurrentClicksRes.interface';

@UseGuards(IsAuthGuard)
@Controller('creator/clicks')
export class ClicksController {
  constructor(private readonly clicksService: ClicksService) {}

  @Get()
  findClicks(@Creator() { creatorId }: CreatorSession): Promise<number> {
    return this.clicksService.findClicks(creatorId);
  }

  // * 최근 광고 클릭 정보 (with pagination)
  @Get('current')
  findCurrentClicks(
    @Creator() { creatorId }: CreatorSession,
    @Query(ValidationPipe) dto: PaginationDto,
  ): Promise<FindCurrentClicksRes> {
    return this.clicksService.findCurrentClicks(creatorId, dto);
  }

  @Get('start-check')
  clickStartCheck(@Creator() { creatorId }: CreatorSession): Promise<CampaignLog> {
    return this.clicksService.clickStartCheck(creatorId) ?? null;
  }
}
