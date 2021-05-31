import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Marketer } from '../../../decorator/sessionData.decorator';
import { MarketerInfo } from '../../../entities/MarketerInfo';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { AdService } from './ad.service';
import { ChangeOnOffStateDto } from './dto/changeOnOffStateDto.dto';
import { FindCashAmountRes } from './interfaces/findCashAmountRes.interface';
import { FindExpenditureCpsRes } from './interfaces/findExpenditureCpsRes.interface';
import { FindExpenditureRes } from './interfaces/findExpenditureRes.interface';

@Controller('marketer/ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findCashAmount(@Marketer() { marketerId }: MarketerSession): Promise<FindCashAmountRes> {
    return this.adService.findCashAmount(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get('on-off')
  findOnOffState(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<Pick<MarketerInfo, 'marketerContraction'>> {
    return this.adService.findOnOffState(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Post('on-off')
  changeOnOffState(
    @Marketer() { marketerId }: MarketerSession,
    @Body() dto: ChangeOnOffStateDto,
  ): Promise<boolean> {
    return this.adService.changeOnOffState(marketerId, dto.onOffState);
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
  findCreatorCount(@Marketer() { marketerId }: MarketerSession) {
    return this.adService.findCreatorCount(marketerId);
  }
}
