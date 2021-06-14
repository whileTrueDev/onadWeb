import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralCodeService } from './referral-code.service';
import { ReferralCodeController } from './referral-code.controller';
import { CreatorReferralCode } from '../../../entities/CreatorReferralCode';

@Module({
  imports: [TypeOrmModule.forFeature([CreatorReferralCode])],
  controllers: [ReferralCodeController],
  providers: [ReferralCodeService],
})
export class ReferralCodeModule {}
