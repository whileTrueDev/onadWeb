import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { MarketerActionLogService, MarketerActionLogType } from '../marketerActionLog.service';
import { AdService } from './ad.service';
import { ChangeOnOffStateDto } from './dto/changeOnOffStateDto.dto';
import { FindCashAmountRes } from './interfaces/findCashAmountRes.interface';
import { FindCreatorCountRes } from './interfaces/findCreatorCountRes.interface';
import { FindExpenditureCpsRes } from './interfaces/findExpenditureCpsRes.interface';
import { FindExpenditureRes } from './interfaces/findExpenditureRes.interface';

@Controller('marketer/ad')
export class AdController {
  constructor(
    private readonly adService: AdService,
    private readonly marketerActionLogService: MarketerActionLogService,
  ) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findCashAmount(@Marketer() { marketerId }: MarketerSession): Promise<FindCashAmountRes> {
    return this.adService.findCashAmount(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get('on-off')
  async findOnOffState(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<{ onOffState: boolean }> {
    const onOffState = await this.adService.findOnOffState(marketerId);
    this.marketerActionLogService.createLog(
      marketerId,
      MarketerActionLogType['광고on/off'],
      JSON.stringify({
        onoffState: onOffState, // on: 1, off : 0
      }),
    );
    return { onOffState };
  }

  @UseGuards(IsAuthGuard)
  @Post('on-off')
  async changeOnOffState(
    @Marketer() { marketerId }: MarketerSession,
    @Body() dto: ChangeOnOffStateDto,
  ): Promise<[boolean, string?]> {
    const result = await this.adService.changeOnOffState(marketerId, dto.onOffState);
    if (!result) return [false, '광고 On/Off에 실패하였습니다. 문제가 지속되는 경우 문의바랍니다.'];
    return [true];
  }

  // *************************************
  // * Analysis Routers
  // *************************************
  @Get('analysis/expenditure')
  findExpenditure(@Marketer() { marketerId }: MarketerSession): Promise<FindExpenditureRes> {
    return this.adService.findExpenditure(marketerId);
  }

  @Get('analysis/expenditure/cps')
  findExpenditureCps(@Marketer() { marketerId }: MarketerSession): Promise<FindExpenditureCpsRes> {
    return this.adService.findExpenditureCps(marketerId);
  }

  @Get('analysis/creator-count')
  findCreatorCount(@Marketer() { marketerId }: MarketerSession): Promise<FindCreatorCountRes> {
    return this.adService.findCreatorCount(marketerId);
  }
}
