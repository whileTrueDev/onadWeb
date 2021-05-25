import { Body, Controller, Patch, ValidationPipe } from '@nestjs/common';
import nanoid from 'nanoid';
import { MarketerInfo } from '../../entities/MarketerInfo';
import { MailService } from '../mail/mail.service';
import { TmpPasswordRes } from './interfaces/tmpPasswordRes.interface';
import { MarketerService } from './marketer.service';

@Controller('marketer')
export class MarketerController {
  constructor(
    private readonly marketerService: MarketerService,
    private readonly mailService: MailService,
  ) {}

  // @Patch()
  // async changePw() {}

  @Patch('tmp-password')
  async generateTmpPassword(
    @Body('marketerId', ValidationPipe) marketerId: MarketerInfo['marketerId'],
    @Body('marketerMail') marketerMail: MarketerInfo['marketerMail'],
  ): Promise<TmpPasswordRes> {
    const marketer = await this.marketerService.findOne(marketerId);
    if (!marketer) return { error: true, message: '해당 ID의 회원이 존재하지 않습니다.' };
    if (!(marketer.marketerMail === marketerMail)) {
      return { error: true, message: 'EMAIL이 일치하지 않습니다.' };
    }
    // 임시 비번 생성
    const tmpPassword = nanoid.nanoid();
    // 광고주 비밀번호를 임시 비밀번호로 설정
    const success = this.marketerService.setTemporaryPassword(marketer.marketerId, tmpPassword);
    if (!success) return { error: true, message: '임시비밀번호 변경중 오류' };
    // 임시 비번 메일링
    const mailId = await this.mailService.sendTmpPasswordMailToMarketer(
      marketerId,
      marketerMail,
      tmpPassword,
    );
    return { error: false, mailId };
  }
}
