import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Marketer } from '../../../../decorator/sessionData.decorator';
import { MerchandisePickupAddresses } from '../../../../entities/MerchandisePickupAddresses';
import { MerchandiseRegistered } from '../../../../entities/MerchandiseRegistered';
import { MarketerSession } from '../../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../../auth/guards/isAuth.guard';
import { SlackService } from '../../../slack/slack.service';
import { CreateMerchandiseDto } from './dto/createMerchandiseDto.dto';
import { DeleteMerchandiseDto } from './dto/deleteMerchandiseDto.dto';
import { FindMerchandisesPaginatedDto } from './dto/findMerchandisesPaginatedDto.dto';
import {
  FindMerchandiseDetail,
  FindMerchandiseRes,
} from './interfaces/findMerchandiseRes.interface';
import { MerchandisesService } from './merchandises.service';

@Controller('marketer/merchandises')
export class MerchandisesController {
  constructor(
    private readonly merchandisesService: MerchandisesService,
    private readonly slackService: SlackService,
  ) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findMerchandisesPaginated(
    @Marketer() { marketerId }: MarketerSession,
    @Query() dto: FindMerchandisesPaginatedDto,
    // do not execute validation pipes. page, offset 파라미터가
    // number로 오는지, string으로 오는지 모르겠음.. @by hwasurr
  ): Promise<MerchandiseRegistered[] | FindMerchandiseDetail[]> {
    if (dto.onlyNotConnected) {
      return this.merchandisesService.findNotConnectedMerchandises(marketerId);
    }
    if (dto.page && dto.offset) {
      return this.merchandisesService.findMerchandisesPaginated(marketerId, dto);
    }
    return this.merchandisesService.findMerchandisesByMarketer(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Post()
  async createMerchandise(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: CreateMerchandiseDto,
  ): Promise<MerchandiseRegistered> {
    const result = await this.merchandisesService.createMerchandise(marketerId, dto);
    // 슬랙메시지
    this.slackService.jsonMessage({
      summary: '[CPS] 상품 등록 알림',
      text: '관리자 페이지에서 방금 등록된 상품을 확인하고, 온애드샵에 업로드하세요.',
      fields: [
        { title: '마케터 아이디', value: marketerId!, short: true },
        { title: '상품명', value: result.name, short: true },
      ],
    });
    return result;
  }

  @UseGuards(IsAuthGuard)
  @Delete()
  deleteMerchandise(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: DeleteMerchandiseDto,
  ): Promise<boolean> {
    return this.merchandisesService.deleteMerchandise(marketerId, dto.id);
  }

  @UseGuards(IsAuthGuard)
  @Get('length')
  findMerchandisesCount(@Marketer() { marketerId }: MarketerSession): Promise<number> {
    return this.merchandisesService.findMerchandisesCount(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get('dup-check')
  duplicateCheck(@Query('name') merchandiseName: string): Promise<boolean> {
    return this.merchandisesService.duplicateCheck(merchandiseName);
  }

  @UseGuards(IsAuthGuard)
  @Get('campaigns')
  findCampaignByMerchandise(
    @Marketer() { marketerId }: MarketerSession,
    @Query('id', ParseIntPipe) merchandiseId: number,
  ): Promise<number> {
    return this.merchandisesService.findCampaignByMerchandise(marketerId, merchandiseId);
  }

  @UseGuards(IsAuthGuard)
  @Get('addresses')
  findAddress(@Marketer() { marketerId }: MarketerSession): Promise<MerchandisePickupAddresses[]> {
    return this.merchandisesService.findMerchandiseAddress(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get(':id')
  findMerchandise(@Param('id', ParseIntPipe) merchandiseId: number): Promise<FindMerchandiseRes> {
    return this.merchandisesService.findMerchandise(merchandiseId);
  }
}
