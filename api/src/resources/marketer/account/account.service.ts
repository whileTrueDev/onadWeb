import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerInfo } from '../../../entities/MarketerInfo';
import encrypto from '../../../utils/encryption';
import { UpdateMarketerAccountDto } from './dto/updateMarketerAccountDto.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(MarketerInfo) private readonly marketerRepo: Repository<MarketerInfo>,
  ) {}

  async findMarketerAccount(
    marketerId: string,
  ): Promise<Pick<MarketerInfo, 'marketerAccountNumber' | 'accountHolder'>> {
    const user = await this.marketerRepo.findOne({
      where: { marketerId },
      select: ['marketerAccountNumber', 'accountHolder'],
    });

    const deciphered = encrypto.decipher(user.marketerAccountNumber);
    return {
      marketerAccountNumber: deciphered,
      accountHolder: user.accountHolder,
    };
  }

  async updateMarketerAccount(marketerId: string, dto: UpdateMarketerAccountDto): Promise<boolean> {
    const accountNumber = `${dto.bankName}_${dto.bankAccount}`;
    const enciphedAccountNum = encrypto.encipher(accountNumber);

    const result = await this.marketerRepo
      .createQueryBuilder()
      .update()
      .set({
        marketerAccountNumber: enciphedAccountNum,
        accountHolder: dto.bankRealName,
      })
      .where('marketerId = :marketerId', { marketerId })
      .execute();

    if (result.affected > 0) return true;
    return false;
  }
}
