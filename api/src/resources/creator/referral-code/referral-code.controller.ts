import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { Creator } from '../../../decorators/sessionData.decorator';
import { CreatorSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { FindReferralCodeDto } from './dto/findReferralCodeDto.dto';
import { FindMyReferralCodeRes } from './interfaces/findMyReferralCodeRes.interface';
import { FindReferralCodeRes } from './interfaces/findReferralCodeRes.interface';
import { ReferralCodeService } from './referral-code.service';

@Controller('creator/referral-code')
export class ReferralCodeController {
  constructor(private readonly referralCodeService: ReferralCodeService) {}

  @Get()
  findReferralCode(@Query(ValidationPipe) dto: FindReferralCodeDto): Promise<FindReferralCodeRes> {
    return this.referralCodeService.findReferralCode(dto.referralCode);
  }

  @UseGuards(IsAuthGuard)
  @Get('my')
  findMyReferralCode(
    @Creator() { creatorId }: CreatorSession,
  ): Promise<FindMyReferralCodeRes | string> {
    return this.referralCodeService.findMyReferralCode(creatorId);
  }
}
