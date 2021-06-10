import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerSettlement } from '../../../entities/MarketerSettlement';
import encrypto from '../../../utils/encryption';
import { CreateMarketerSettlementDto } from './dto/createMarketerSettlementDto.dto';
import { UpdateMarketerSettlementDto } from './dto/updateMarketerSettlementDto.dto';
import { FindMarketerSettlementRes } from './interfaces/FindMarketerSettlementRes.interface';

@Injectable()
export class SettlementService {
  constructor(
    @InjectRepository(MarketerSettlement)
    private readonly marketerSettlementRepo: Repository<MarketerSettlement>,
  ) {}

  async findOne(marketerId: string): Promise<MarketerSettlement> {
    const data = await this.marketerSettlementRepo.findOne({
      where: { marketerId },
      order: { createDate: 'ASC' },
    });
    if (!data) return null;
    return this.decryptSettlement(data);
  }

  async findAll(marketerId: string): Promise<MarketerSettlement[]> {
    const data = await this.marketerSettlementRepo.find({
      where: { marketerId },
      order: { createDate: 'ASC' },
    });
    return data.map(settlement => this.decryptSettlement(settlement));
  }

  async createOne(
    marketerId: string,
    dto: CreateMarketerSettlementDto,
  ): Promise<MarketerSettlement> {
    const encryptedDto = this.encryptSettlement(dto);
    const newSettlement = this.marketerSettlementRepo.create({ ...encryptedDto, marketerId });
    return this.marketerSettlementRepo.save(newSettlement);
  }

  async updateOne(marketerId: string, dto: UpdateMarketerSettlementDto): Promise<boolean> {
    const result = await this.marketerSettlementRepo
      .createQueryBuilder()
      .update()
      .set({ ...dto, state: false, marketerId })
      .where('id = :id AND marketerId = :marketerId', { id: dto.id, marketerId })
      .execute();
    if (result.affected > 0) return true;
    return false;
  }

  /**
   * 해당 정산 등록을 삭제합니다.
   * @param marketerId 마케터 고유 아이디
   * @param id 정산등록 아이디
   * @returns affectedRows를 반환합니다. 1인 경우 삭제가 완료된 것이고, 0인 경우 삭제에 실패한 것입니다.
   */
  async deleteOne(marketerId: string, id: number): Promise<boolean> {
    const result = await this.marketerSettlementRepo
      .createQueryBuilder()
      .delete()
      .where('id = :id AND marketerId = :marketerId', { marketerId, id })
      .execute();

    if (result.affected > 0) return true;
    return false;
  }

  // ***********************************************************
  // * Private methods
  // ***********************************************************

  /**
   * * 계좌번호 형식 생성
   */
  private makeAccountNumber(bankName: string, account: string): string {
    return `${bankName}_${account}`;
  }

  /**
   * * 계좌번호 형식 -> 은행, 계좌번호 분할
   */
  private decomposeAccountNumber(accountNumber: string): { bankName: string; account: string } {
    const [bankName, account] = accountNumber.split('_');
    return { bankName, account };
  }

  /**
   * * 정산등록 객체의 데이터를 모두 암호화합니다.
   * @param dto 정산등록 POST DTO
   * @returns 복호화를 진행한 정산 등록 객체를 반환합니다.
   */
  private encryptSettlement<T extends CreateMarketerSettlementDto>(dto: T): T {
    return {
      ...dto,
      // 계좌번호 암호화
      bankAccountNumber: encrypto.encipher(
        this.makeAccountNumber(dto.bankName, dto.bankAccountNumber),
      ),
      // 주민등록번호 암호화
      identificationNumber: encrypto.encipher(dto.identificationNumber),
      // 주민등록증 이미지 암호화
      identificationImgSrc: encrypto.encipher(dto.identificationImgSrc),
      // 통장 사본 이미지 암호화
      bankAccountImgSrc: encrypto.encipher(dto.bankAccountImgSrc),
    };
  }

  /**
   * * 정산등록 객체의 암호화된 데이터를 모두 복호화합니다.
   * @param settlement 정산등록 객체
   * @returns 복호화를 진행한 정산 등록 객체를 반환합니다.
   */
  private decryptSettlement(settlement: MarketerSettlement): FindMarketerSettlementRes {
    const decipherAccountNumber = encrypto.decipher(settlement.bankAccountNumber);
    const { account, bankName } = this.decomposeAccountNumber(decipherAccountNumber);
    return {
      ...settlement,
      bankName,
      bankAccountNumber: account,
      identificationNumber: encrypto.decipher(settlement.identificationNumber),
      identificationImgSrc: encrypto.decipher(settlement.identificationImgSrc),
      bankAccountImgSrc: encrypto.decipher(settlement.bankAccountImgSrc),
    };
  }
}
