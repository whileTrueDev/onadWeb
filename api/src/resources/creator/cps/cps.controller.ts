import { Controller, Get, UseGuards } from '@nestjs/common';
import { Creator } from '../../../decorators/sessionData.decorator';
import { CreatorSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { CpsService } from './cps.service';
import { FindCpsChartDataRes } from './interfaces/findCpsChartDataRes.interface';
import { FindCpsMetaInfoRes } from './interfaces/findCpsMetaInfoRes.interface';
import { FindCpsReviewRes } from './interfaces/findCpsReviewsRes.interface';

@UseGuards(IsAuthGuard)
@Controller('creator/cps')
export class CpsController {
  constructor(private readonly cpsService: CpsService) {}

  @Get()
  findCpsMetaInfo(@Creator() { creatorId }: CreatorSession): Promise<FindCpsMetaInfoRes> {
    return this.cpsService.findCpsMetaInfo(creatorId);
  }

  @Get('chart')
  findCpsChartData(@Creator() { creatorId }: CreatorSession): Promise<FindCpsChartDataRes> {
    return this.cpsService.findCpsChartData(creatorId);
  }

  @Get('reviews')
  findCpsReviews(@Creator() { creatorId }: CreatorSession): Promise<FindCpsReviewRes> {
    return this.cpsService.findCpsReviews(creatorId);
  }
}
