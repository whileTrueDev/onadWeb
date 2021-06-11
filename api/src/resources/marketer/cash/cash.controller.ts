import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerDebit } from '../../../entities/MarketerDebit';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { SlackService } from '../../slack/slack.service';
import { MarketerActionLogService, MarketerActionLogType } from '../marketerActionLog.service';
import { NotificationService } from '../notification/notification.service';
import { CashHistoryService } from './cash-history.service';
import { CashService } from './cash.service';
import { FindUsageHistoryMonthlyDto } from './dto/findUsageHistoryMonthlyDto.dto';
import { MarketerCashCargeDto } from './dto/marketerCashCargeDto.dto';
import { MarketerCashChargeByCardDto } from './dto/marketerCashChargeByCardDto.dto';
import { FindUsageHistoryResWithMetadata } from './interfaces/findUsageHistoryRes.interface';
import { MarketerChargeRes } from './interfaces/marketerChargeRes.interface';

@Controller('marketer/cash')
export class CashController {
  constructor(
    private readonly cashHistoryService: CashHistoryService,
    private readonly cashService: CashService,
    private readonly slackService: SlackService,
    private readonly marketerNotiService: NotificationService,
    private readonly marketerLogService: MarketerActionLogService,
  ) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findCashAmount(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<Pick<MarketerDebit, 'cashAmount' | 'date'>> {
    return this.cashService.findCashAmount(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Post('charge')
  async chargeCard(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: MarketerCashCargeDto,
  ): Promise<[boolean]> {
    const result = await this.cashService.charge(marketerId, dto);
    if (result) {
      this.slackService.jsonMessage({
        summary: '마케터 캐시 충전(카드or계좌이체) 알림',
        text: '마케터가 캐시를 충전했습니다. 확인해주세요.',
        fields: [
          { title: '마케터 아이디', value: marketerId, short: true },
          { title: '캐시 충전 금액', value: result.cash.toString(), short: true },
        ],
      });
      return [true];
    }
    return [false];
  }

  @UseGuards(IsAuthGuard)
  @Post('charge/card')
  async charge(
    @Marketer() { marketerId, marketerName }: MarketerSession,
    @Body(ValidationPipe) dto: MarketerCashChargeByCardDto,
  ): Promise<MarketerChargeRes> {
    // 충전 진행
    const result = await this.cashService.chargeCard(marketerId, dto);

    if (result.status === 'vbankIssued') {
      // 슬랙 알림
      this.slackService.jsonMessage({
        summary: '마케터 캐시 충전(가상계좌발급) 알림',
        text: '마케터가 캐시를 충전했습니다. 확인해주세요.',
        fields: [
          { title: '마케터 아이디', value: marketerId, short: true },
          { title: '캐시 충전 금액', value: result.chargedCashAmount.toString(), short: true },
          { title: '가상 계좌 이름', value: result.vbank_name, short: true },
          { title: '가상 계좌 번호', value: result.vbank_num, short: true },
          { title: 'vbankDate', value: result.vbank_date, short: true },
        ],
      });
      // 광고주 개인알림
      await this.marketerNotiService.vBankChargeReadyNoti(marketerId, {
        cashAmount: result.chargedCashAmount.toString(),
        vbankName: result.vbank_name,
        vbankNum: result.vbank_num,
        marketerName,
      });
      return result;
    }
    if (result.status === 'success') {
      // 슬랙알림
      this.slackService.jsonMessage({
        summary: '마케터 캐시 충전(카드or계좌이체) 알림',
        text: '마케터가 캐시를 충전했습니다. 확인해주세요.',
        fields: [
          { title: '마케터 아이디', value: marketerId, short: true },
          { title: '캐시 충전 금액', value: result.chargedCashAmount.toString(), short: true },
        ],
      });
      return result;
    }
    throw new InternalServerErrorException();
  }

  @UseGuards(IsAuthGuard)
  @Post('refund')
  async refund(
    @Marketer() { marketerId }: MarketerSession,
    @Body('withdrawCash', ParseIntPipe) withdrawCash: number,
  ): Promise<[boolean]> {
    const result = await this.cashService.refund(marketerId, withdrawCash);
    if (!result) return [false];

    // 슬랙 알림
    this.slackService.jsonMessage({
      summary: '마케터 환불 요청 알림',
      text: '마케터가 환불을 요청했습니다. 확인해주세요.',
      fields: [
        { title: '마케터 아이디', value: marketerId, short: true },
        { title: '환불 요청 금액', value: withdrawCash.toString(), short: true },
      ],
    });
    // 마케터 action log
    this.marketerLogService.createLog(
      marketerId,
      MarketerActionLogType.환불요청,
      JSON.stringify({ refundCash: withdrawCash }),
    );
    return [result];
  }

  @UseGuards(IsAuthGuard)
  @Post('vbank')
  async updateChargeVbankState(@Marketer() { marketerId }: MarketerSession): Promise<[boolean]> {
    const result = await this.cashService.updateChargeVbankState(marketerId);
    return [result];
  }

  // **************************
  // * history 캐시 충전 및 사용 내역
  // **************************

  // * 캐시 충전 내역
  @UseGuards(IsAuthGuard)
  @Get('history/charge')
  async findChargeHistory(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<{ data: Array<string | Date>[] }> {
    const data = await this.cashHistoryService.findChargeHistory(marketerId);
    return { data };
  }

  // * 캐시 환불 내역
  @UseGuards(IsAuthGuard)
  @Get('history/refund')
  async findRefundHistory(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<{ data: string[][] }> {
    const data = await this.cashHistoryService.findRefundHistory(marketerId);
    return { data };
  }

  // * 캐시 사용 내역
  @UseGuards(IsAuthGuard)
  @Get('history/usage')
  async findUsageHistory(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<{ data: string[][] }> {
    const data = await this.cashHistoryService.findUsageHistory(marketerId);
    return { data };
  }

  @UseGuards(IsAuthGuard)
  @Get('history/usage/month')
  findUsageHistoryMohthly(
    @Marketer() { marketerId }: MarketerSession,
    @Query() dto: FindUsageHistoryMonthlyDto,
  ): Promise<FindUsageHistoryResWithMetadata> {
    return this.cashHistoryService.findUsageHistoryMohthly(marketerId, dto.month);
  }
}
