import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreatorIncome } from '../../../entities/CreatorIncome';
import { CreatorWithdrawal } from '../../../entities/CreatorWithdrawal';
import { CampaignLogRepository } from '../../../repositories/CampaignLog.repository';
import { CreatorInfoRepository } from '../../../repositories/CreatorInfo.repository';
import encrypto from '../../../utils/encryption';
import { transactionQuery } from '../../../utils/transactionQuery';
import { FindIncomeChartDataRes } from './interfaces/findIncomeChartDataRes.interface';
import { FindIncomeDataRes } from './interfaces/findIncomeDataRes.interface';
import { FindIncomeRaitoDataRes } from './interfaces/findIncomeRatioDataRes.interface';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(CreatorWithdrawal)
    private readonly creatorWithdrawalRepo: Repository<CreatorWithdrawal>,
    @InjectRepository(CreatorIncome) private readonly creatorIncomeRepo: Repository<CreatorIncome>,
    @InjectRepository(CampaignLogRepository)
    private readonly campaignLogRepo: CampaignLogRepository,
    @InjectRepository(CreatorInfoRepository)
    private readonly creatorInfoRepo: CreatorInfoRepository,
    private readonly connection: Connection,
  ) {}

  // * 크리에이터 수익금 정보 조회
  public async findIncomeData(creatorId: string): Promise<FindIncomeDataRes> {
    const data: FindIncomeDataRes = await this.creatorInfoRepo
      .createQueryBuilder('ci')
      .select(`ci.settlementState, creatorTotalIncome, creatorReceivable, creatorAccountNumber`)
      .addSelect('creatorIncome.date, creatorContractionAgreement, realName')
      .innerJoin(CreatorIncome, 'creatorIncome', 'ci.creatorId = creatorIncome.creatorId')
      .where('ci.creatorId = :creatorId', { creatorId })
      .orderBy('date', 'DESC')
      .getRawOne();

    if (!data) return null;
    const deciphed = encrypto.decipher(data.creatorAccountNumber);
    data.creatorAccountNumber = deciphed;
    return data;
  }

  // * 크리에이터 수익금 수익종류별(CPM,CPC,CPA,CPS) 비율 데이터 조회
  public findIncomeRatioData(creatorId: string): Promise<FindIncomeRaitoDataRes[]> {
    return this.campaignLogRepo
      .createQueryBuilder()
      .select('creatorId, type, SUM(cashToCreator) as cashAmount')
      .where('creatorId = :creatorId', { creatorId })
      .groupBy('type')
      .getRawMany();
  }

  // * 크리에이터 출금 내역 조회
  public findWithdrawalHistory(
    creatorId: string,
  ): Promise<Pick<CreatorWithdrawal, 'date' | 'creatorWithdrawalAmount' | 'withdrawalState'>[]> {
    return this.creatorWithdrawalRepo.find({
      where: { creatorId },
      select: ['date', 'creatorWithdrawalAmount', 'withdrawalState'],
      order: { date: 'DESC' },
    });
  }

  // * 크리에이터 출금 신청
  public async createWithdrawal(creatorId: string, amount: number): Promise<string> {
    return transactionQuery(
      this.connection,
      async queryRunner => {
        // 출금 내역 생성
        await queryRunner.manager.save(CreatorWithdrawal, {
          creatorId,
          creatorWithdrawalAmount: amount,
          withdrawalState: 0,
        });

        // 출금량만큼 수익금에서 제외
        await queryRunner.manager.query(
          `INSERT INTO creatorIncome (creatorId, creatorTotalIncome, creatorReceivable)
         SELECT creatorId, creatorTotalIncome, creatorReceivable - ?
         FROM creatorIncome
         WHERE creatorId = ?
         ORDER BY date DESC
         LIMIT 1`,
          [amount, creatorId],
        );
        return 'done';
      },
      { errorMessage: 'An error occurred during - create creator withdrawal' },
    );
  }

  // * 크리에이터 일별 수익 내역 차트 데이터 조회
  public findIncomeChartData(
    creatorId: string,
    dateRange: number,
  ): Promise<FindIncomeChartDataRes> {
    return this.campaignLogRepo
      .createQueryBuilder('cl')
      .select('DATE_FORMAT(cl.date, "%Y-%m-%d") as date')
      .addSelect('sum(cashToCreator) as value, type')
      .where('creatorId = :creatorId', { creatorId })
      .andWhere('cl.date >= DATE_SUB(NOW(), INTERVAL :dateRange DAY)', { dateRange })
      .groupBy('DATE_FORMAT(cl.date, "%Y-%m-%d"), type')
      .orderBy('cl.date', 'DESC')
      .getRawMany();
  }
}
