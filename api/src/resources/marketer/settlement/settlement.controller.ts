import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Marketer } from '../../../decorator/sessionData.decorator';
import { MarketerSettlement } from '../../../entities/MarketerSettlement';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { SlackService } from '../../slack/slack.service';
import { CreateMarketerSettlementDto } from './dto/createMarketerSettlementDto.dto';
import { UpdateMarketerSettlementDto } from './dto/updateMarketerSettlementDto.dto';
import { SettlementLogsService } from './settlement-logs.service';
import { SettlementService } from './settlement.service';

@Controller('marketer/settlement')
export class SettlementController {
  constructor(
    private readonly settlementService: SettlementService,
    private readonly settlementLogsService: SettlementLogsService,
    private readonly slackService: SlackService,
  ) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findOne(@Marketer() { marketerId }: MarketerSession): Promise<MarketerSettlement> {
    return this.settlementService.findOne(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Post()
  async createOne(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: CreateMarketerSettlementDto,
  ): Promise<MarketerSettlement> {
    const newSettlement = await this.settlementService.createOne(marketerId, dto);
    this.slackService.jsonMessage({
      summary: '광고주 판매대금 정산 등록 알림',
      text: '광고주가 판매대금 정산을 등록했습니다. 확인하고 검수를 진행해주세요.',
      fields: [
        { title: '방송인 아이디', value: marketerId!, short: true },
        { title: '은행', value: dto.bankName!, short: true },
      ],
    });
    return newSettlement;
  }

  @UseGuards(IsAuthGuard)
  @Patch()
  async updateOne(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: UpdateMarketerSettlementDto,
  ): Promise<boolean> {
    const result = await this.settlementService.updateOne(marketerId, dto);
    this.slackService.jsonMessage({
      summary: '광고주 판매대금 정산 재등록(수정) 알림',
      text: '광고주가 판매대금 정산을 재등록(수정)했습니다. 확인하고 검수를 진행해주세요.',
      fields: [
        { title: '방송인 아이디', value: marketerId!, short: true },
        { title: '은행', value: dto.bankName!, short: true },
      ],
    });
    return result;
  }

  @UseGuards(IsAuthGuard)
  @Delete()
  deleteOne(
    @Marketer() { marketerId }: MarketerSession,
    @Body('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    if (!id) throw new BadRequestException('id parameter is required');
    return this.settlementService.deleteOne(marketerId, id);
  }

  @UseGuards(IsAuthGuard)
  @Get('/list')
  findAll(@Marketer() { marketerId }: MarketerSession): Promise<MarketerSettlement[]> {
    return this.settlementService.findAll(marketerId);
  }

  // *****************************************************
  // * SettlementLogs
  // *****************************************************
  @UseGuards(IsAuthGuard)
  @Get('/logs')
  findSettlementLogs(@Marketer() { marketerId }: MarketerSession): Promise<Array<string[]>> {
    return this.settlementLogsService.findAll(marketerId);
  }
}
