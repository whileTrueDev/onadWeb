import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { MarketerDebit } from '../../entities/MarketerDebit';
import { MarketerInfo } from '../../entities/MarketerInfo';
import { MarketerSalesIncome } from '../../entities/MarketerSalesIncome';
import encrypto from '../../utils/encryption';
import { transactionQuery } from '../../utils/transactionQuery';
import { CreateNewMarketerDto } from './dto/createNewMarketerDto.dto';
import { CreateNewMarketerWithSocialLoginDto } from './dto/createNewMarketerWithSocialLoginDto.dto';
import { FindMarketerIdDto } from './dto/findMarketerIdDto.dto';
import { CreateNewMarketerRes } from './interfaces/createNewMarketerRes.interface';

@Injectable()
export class MarketerService {
  constructor(
    @InjectRepository(MarketerInfo) private readonly marketerInfoRepo: Repository<MarketerInfo>,
    @InjectRepository(MarketerDebit) private readonly marketerDebitRepo: Repository<MarketerDebit>,
    @InjectRepository(MarketerSalesIncome)
    private readonly marketerSalesIncomeRepo: Repository<MarketerSalesIncome>,
    private readonly connection: Connection,
  ) {}

  /**
   * 신규 마케터 생성
   */
  async createNewMarketer(dto: CreateNewMarketerDto): Promise<CreateNewMarketerRes> {
    const [key, salt] = encrypto.make(dto.marketerRawPasswd);
    const newMarketer = this.marketerInfoRepo.create({
      marketerId: dto.marketerId,
      marketerPasswd: key,
      marketerSalt: salt,
      marketerName: dto.marketerName,
      marketerMail: dto.marketerMail,
      marketerPhoneNum: dto.marketerPhoneNum,
    });

    const newMarketerDebit = this.marketerDebitRepo.create({
      marketerId: dto.marketerId,
      cashAmount: 0,
    });

    const newSalesIncome = this.marketerSalesIncomeRepo.create({
      marketerId: dto.marketerId,
      totalIncome: 0,
      receivable: 0,
    });

    await transactionQuery(
      this.connection,
      async queryRunner => {
        await queryRunner.manager.save(newMarketer);
        await queryRunner.manager.save(newMarketerDebit);
        await queryRunner.manager.save(newSalesIncome);
      },
      { errorMessage: 'An Error occurred during 신규 마케터 생성' },
    );

    return { error: false, result: 'Email skip!' };
  }

  /**
   * 신규 광고주 생성 - 소셜로그인 (구글, 네이버, 카카오 등)
   */
  async createNewMarketerWithSocialLogin(
    dto: CreateNewMarketerWithSocialLoginDto,
  ): Promise<CreateNewMarketerRes> {
    const newMarketer = this.marketerInfoRepo.create({
      marketerId: dto.marketerId,
      marketerName: dto.marketerName,
      marketerMail: dto.marketerMail,
      marketerPhoneNum: dto.marketerPhoneNum,
      platformType: dto.platformType,
    });

    const newMarketerDebit = this.marketerDebitRepo.create({
      marketerId: dto.marketerId,
      cashAmount: 0,
    });

    const newSalesIncome = this.marketerSalesIncomeRepo.create({
      marketerId: dto.marketerId,
      totalIncome: 0,
      receivable: 0,
    });

    await transactionQuery(
      this.connection,
      async queryRunner => {
        await queryRunner.manager.save(newMarketer);
        await queryRunner.manager.save(newMarketerDebit);
        await queryRunner.manager.save(newSalesIncome);
      },
      { errorMessage: 'An error occurred during 신규 광고주 생성 - 소셜로그인' },
    );
    return { error: false };
  }

  /**
   * 개별 광고주 조회
   * @param marketerId 마케터 고유 아이디
   * @returns marketerInfo
   */
  async findOne(marketerId: string): Promise<MarketerInfo> {
    return this.marketerInfoRepo.findOne({ where: { marketerId } });
  }

  /**
   * marketerMail과 marketerName에 따른 광고주 아이디 찾기
   * @returns marketerInfo
   */
  async findMarketerId(dto: FindMarketerIdDto): Promise<Pick<MarketerInfo, 'marketerId'>> {
    return this.marketerInfoRepo.findOne({
      where: { marketerMail: dto.marketerMail, marketerName: dto.marketerName },
      select: ['marketerId'],
    });
  }

  /**
   * platform에 따른 개별 광고주 조회
   * @param marketerId 광고주 고유 아이디
   * @param platform google, naver, kakao
   * @returns marketerInfo
   */
  async findOneByPlatform(
    marketerId: string,
    platform: 'google' | 'naver' | 'kakao',
  ): Promise<MarketerInfo> {
    let platformId = 0;
    switch (platform) {
      case 'google':
        platformId = 1;
        break;
      case 'naver':
        platformId = 2;
        break;
      case 'kakao':
        platformId = 3;
        break;
      default:
        platformId = 0;
    }
    return this.marketerInfoRepo.findOne(marketerId, { where: { platformType: platformId } });
  }

  /**
   * 특정 광고주 임시 비밀번호 설정
   */
  async changePassword(marketerId: string, newPw: string, isTemp?: boolean): Promise<boolean> {
    const [key, salt] = encrypto.make(newPw);
    const result = await this.marketerInfoRepo
      .createQueryBuilder()
      .update()
      .set({ marketerSalt: salt, marketerPasswd: key, temporaryLogin: isTemp ? 1 : 0 })
      .where('marketerId = :marketerId', { marketerId })
      .execute();
    if (result.affected > 0) return true;
    return false;
  }

  async updateMarketerInfo(
    marketerId: string,
    field: 'marketerPhoneNum' | 'marketerName' | 'marketerMail' | 'profileImage',
    value: string,
  ): Promise<number> {
    const result = await this.marketerInfoRepo
      .createQueryBuilder()
      .update()
      .set({ [field]: value })
      .where('marketerId = :marketerId', { marketerId })
      .execute();

    if (result.affected) return result.affected;
    return 0;
  }

  /**
   * 광고주 정보를 삭제합니다(null처리).
   * @param marketerId 탈퇴할 광고주 아이디
   * @returns boolean
   */
  async deleteMarketerInfo(marketerId: string): Promise<boolean> {
    const result = await this.marketerInfoRepo
      .createQueryBuilder()
      .update()
      .set({
        marketerPasswd: null,
        marketerSalt: null,
        marketerName: null,
        marketerMail: null,
        marketerPhoneNum: null,
        marketerBusinessRegNum: null,
        marketerBusinessRegSrc: null,
        marketerContraction: null,
        marketerAlarmAgreement: null,
        marketerEmailAuth: null,
        date: null,
        temporaryLogin: null,
        marketerAccountNumber: null,
        accountHolder: null,
        profileImage: null,
        signOutState: 2,
        signOutDate: new Date(),
      })
      .where('marketerId = :marketerId', { marketerId })
      .execute();

    if (result.affected) return true;
    return false;
  }
}
