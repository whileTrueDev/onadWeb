import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Marketer } from '../../../../decorators/sessionData.decorator';
import { PaginationDto } from '../../../../dto/paginationDto.dto';
import { Campaign } from '../../../../entities/Campaign';
import { LinkRegistered } from '../../../../entities/LinkRegistered';
import { MarketerSession } from '../../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../../auth/guards/isAuth.guard';
import { SlackService } from '../../../slack/slack.service';
import { CreateLandingUrlDto } from './dto/createLandingUrlDto.dto';
import { DeleteLandingUrlDto } from './dto/deleteLandingUrlDto.dto';
import { FindCampaignByLandingUrlDto } from './dto/findCampaignByLandingUrlDto.dto';
import { LandingUrlService } from './landing-url.service';

@Controller('marketer/landing-url')
export class LandingUrlController {
  constructor(
    private readonly landingUrlService: LandingUrlService,
    private readonly slackService: SlackService,
  ) {}

  @UseGuards(IsAuthGuard)
  @Post()
  async createLandingUrl(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: CreateLandingUrlDto,
  ): Promise<LinkRegistered> {
    const result = await this.landingUrlService.createLandingUrl(marketerId, dto);

    if (result) {
      this.slackService.jsonMessage({
        summary: '랜딩 URL 등록 알림',
        text: '관리자 페이지에서 방금 등록된 랜딩 Url을 확인하고, 심사하세요.',
        fields: [
          { title: '마케터 아이디', value: marketerId!, short: true },
          { title: '링크 아이디', value: result.linkId!, short: true },
          { title: '링크 개수', value: result.links.length.toString(), short: true },
        ],
      });
    }
    return result;
  }

  @UseGuards(IsAuthGuard)
  @Delete()
  deleteLandingUrl(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: DeleteLandingUrlDto,
  ): Promise<boolean> {
    return this.landingUrlService.deleteLandingUrl(marketerId, dto.linkId);
  }

  @UseGuards(IsAuthGuard)
  @Get('/list')
  findLandingUrlsPaginated(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: Partial<PaginationDto>,
  ): Promise<Array<LinkRegistered & { id: string }>> {
    if (dto) {
      return this.landingUrlService.findLandingUrlsPaginated(marketerId, dto);
    }
    return this.landingUrlService.findLandingUrls(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get('/length')
  findAllLandingUrlCounts(@Marketer() { marketerId }: MarketerSession): Promise<number> {
    return this.landingUrlService.findAllLandingUrlCounts(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get('/campaigns')
  findCampaignByLandingUrl(
    @Marketer() { marketerId }: MarketerSession,
    @Query(ValidationPipe) dto: FindCampaignByLandingUrlDto,
  ): Promise<Pick<Campaign, 'campaignId'>[]> {
    return this.landingUrlService.findCampaignByLandingUrl(marketerId, dto.linkId);
  }
}
