import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerSalesIncomeSettlementLogs } from '../../../entities/MarketerSalesIncomeSettlementLogs';
import { MarketerSettlement } from '../../../entities/MarketerSettlement';
import { MerchandiseOrdersDetail } from '../../../entities/MerchandiseOrdersDetail';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { SlackService } from '../../slack/slack.service';
import { CreateMarketerSettlementDto } from './dto/createMarketerSettlementDto.dto';
import { UpdateMarketerSettlementDto } from './dto/updateMarketerSettlementDto.dto';
import { FindSettlementLogsRes } from './interfaces/FindSettlementLogsRes.interface';
import { SettlementLogsService } from './settlement-logs.service';
import { SettlementService } from './settlement.service';

@UseGuards(IsAuthGuard)
@Controller('marketer/settlement')
export class SettlementController {
  constructor(
    private readonly settlementService: SettlementService,
    private readonly settlementLogsService: SettlementLogsService,
    private readonly slackService: SlackService,
  ) {}

  @Get()
  findOne(@Marketer() { marketerId }: MarketerSession): Promise<MarketerSettlement | null> {
    return this.settlementService.findOne(marketerId);
  }

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
        { title: '방송인 아이디', value: marketerId, short: true },
        { title: '은행', value: dto.bankName, short: true },
      ],
    });
    return newSettlement;
  }

  @Patch()
  async updateOne(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: UpdateMarketerSettlementDto,
  ): Promise<number> {
    const result = await this.settlementService.updateOne(marketerId, dto);
    this.slackService.jsonMessage({
      summary: '광고주 판매대금 정산 재등록(수정) 알림',
      text: '광고주가 판매대금 정산을 재등록(수정)했습니다. 확인하고 검수를 진행해주세요.',
      fields: [
        { title: '방송인 아이디', value: marketerId, short: true },
        { title: '은행', value: dto.bankName, short: true },
      ],
    });
    return result ? 1 : 0;
  }

  @Delete()
  deleteOne(
    @Marketer() { marketerId }: MarketerSession,
    @Body('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    if (!id) throw new BadRequestException('id parameter is required');
    return this.settlementService.deleteOne(marketerId, id);
  }

  @Get('/list')
  findAll(@Marketer() { marketerId }: MarketerSession): Promise<MarketerSettlement[]> {
    return this.settlementService.findAll(marketerId);
  }

  // *****************************************************
  // * SettlementLogs
  // *****************************************************
  @Get('/logs')
  findSettlementLogs(
    @Marketer() { marketerId }: MarketerSession,
    @Query('settlementLogId') settlementLogId?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ): Promise<
    | Array<Omit<MarketerSalesIncomeSettlementLogs, 'doneDate'> & { doneDate: string }>
    | FindSettlementLogsRes
  > {
    if (year && month) {
      return this.settlementLogsService.findAllByOrder(marketerId, year, month);
    }
    if (settlementLogId) {
      return this.settlementLogsService.findAllById(marketerId, Number(settlementLogId));
    }
    return this.settlementLogsService.findAllMonthly(marketerId, year || new Date().getFullYear());
  }

  @Get('/logs/years')
  findSettlementLogsYears(@Marketer() { marketerId }: MarketerSession): Promise<string[]> {
    return this.settlementLogsService.findYears(marketerId);
  }

  @Get('/logs/months')
  findSettlementLogsMonths(@Marketer() { marketerId }: MarketerSession): Promise<string[]> {
    return this.settlementLogsService.findMonths(marketerId);
  }
}
