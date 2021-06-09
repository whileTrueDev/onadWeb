import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorInfo } from '../../../entities/CreatorInfo';
import { FindReferralCodeRes } from './interfaces/findReferralCodeRes.interface';
import { CreatorReferralCode } from '../../../entities/CreatorReferralCode';
import { CreatorReferralCodeLogs } from '../../../entities/CreatorReferralCodeLogs';
import { FindMyReferralCodeRes } from './interfaces/findMyReferralCodeRes.interface';

@Injectable()
export class ReferralCodeService {
  constructor(
    @InjectRepository(CreatorReferralCode)
    private readonly referralCodeRepo: Repository<CreatorReferralCode>,
  ) {}

  // * 추천인코드 아이디로 추천인 코드 조회
  public async findReferralCode(referralCode: string): Promise<FindReferralCodeRes> {
    return this.referralCodeRepo
      .createQueryBuilder('a')
      .select('a.creatorId, a.referralCode, creatorName, afreecaName, loginId, calculateState')
      .innerJoin(CreatorInfo, 'c', 'a.creatorId = c.creatorId')
      .leftJoin(CreatorReferralCodeLogs, 'l', 'a.referralCode = l.referralCode')
      .where('a.referralCode = :referralCode', { referralCode })
      .getRawOne();
  }

  // * 내 추천인 코드 조회
  public async findMyReferralCode(creatorId: string): Promise<FindMyReferralCodeRes | string> {
    const result = await this.referralCodeRepo
      .createQueryBuilder('A')
      .select('A.referralCode, calculateState, B.createdAt, B.calculatedAt')
      .addSelect('C.creatorName, C.afreecaName, C.loginId, C.creatorContractionAgreement')
      .leftJoin(CreatorReferralCodeLogs, 'B', 'A.referralCode = B.referralCode')
      .innerJoin(CreatorInfo, 'C', 'A.creatorId = C.creatorId')
      .where('A.creatorId = :creatorId', { creatorId })
      .getRawOne();
    if (!result) return 'referral-code is not exists';
    return result;
  }
}
