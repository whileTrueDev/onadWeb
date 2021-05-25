import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import createMarketerPwMail from './templates/createMarketerPwMail';

@Injectable()
export class MailService {
  private transporter: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: configService.get<string>('MAIL_ID'),
        pass: configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  /**
   * 광고주에게 임시 비밀번호 메일을 보냅니다.
   * @param marketerId 광고주 아이디
   * @param marketerMail 광고주 메일주소
   * @param password 임시 비밀번호
   * @returns {string} messageId
   */
  public async sendTmpPasswordMailToMarketer(
    marketerId: string,
    marketerMail: string,
    password: string,
  ): Promise<string> {
    const mailOptions: SendMailOptions = {
      from: 'ONAD <support@onad.io>', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
      to: marketerMail, // 수신 메일 주소부분
      subject: `[ONAD] ${marketerId} 님, 임시 비밀번호가 발급 되었습니다.`, // 제목
      html: createMarketerPwMail(marketerId, password),
    };

    const mailRes = await this.transporter.sendMail(mailOptions);
    return mailRes.messageId;
  }
}
