import axios from 'axios';
import Crypto from 'crypto-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerCashBurnAlimtalkDto } from './dto/marketerCashBurnAlimtalkDto.dto';
import { MarketerInfo } from '../../entities/MarketerInfo';
import { KakaoAlimtalk } from '../../entities/KakaoAlimtalk';

interface NaverCloudButton {
  type: string;
  name: string;
  linkMobile: string;
  linkPc: string;
}

interface NaverCloudMessage {
  countryCode: string;
  to: string; // marketer phone number
  content: string;
  buttons: NaverCloudButton[];
}

interface NaverCloudMessageResponse {
  messageId: string;
  countryCode: string;
  to: string;
  content: string;
  requestStatusCode: string;
  requestStatusName: string;
  requestStatusDesc: string;
}

interface NaverCloudSendingData {
  templateCode: string;
  plusFriendId: string;
  messages: NaverCloudMessage[];
}

@Injectable()
export class AlimtalkService {
  private SERVICE_ID: string;
  private ALIM_TALK_SERVICE_URL: string;
  private COUNTRY_CODE_KR = '82'; // countryCodes
  private PLUS_FRIEND_ID = '@onad'; // kakao plus friends id
  private NAVER_CLOUD_SENS_URL = 'https://sens.apigw.ntruss.com';

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(MarketerInfo) private readonly marketerInfoRepo: Repository<MarketerInfo>,
    @InjectRepository(KakaoAlimtalk) private readonly alimtalkRepo: Repository<KakaoAlimtalk>,
  ) {
    // for request
    this.SERVICE_ID = this.configService.get<string>('NAVER_CLOUD_BIZMESSAGE_SERVICE_ID');
    this.ALIM_TALK_SERVICE_URL = `/alimtalk/v2/services/${this.SERVICE_ID}/messages`;
  }

  // * 광고주 캐시 소진 알림톡
  public async marketerCashBurnAlimtalk(dto: MarketerCashBurnAlimtalkDto): Promise<string> {
    const { marketerId } = dto;
    const nowtime = new Date().getTime().toString();
    const SIGNATURE = this.makeSignature('POST', this.ALIM_TALK_SERVICE_URL, nowtime);

    const sendingHeader = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': nowtime,
      'x-ncp-iam-access-key': process.env.NAVER_CLOUD_ACCESS_KEY,
      'x-ncp-apigw-signature-v2': SIGNATURE,
    };

    const { marketerName, marketerPhoneNum } = await this.marketerInfoRepo.findOne({
      where: { marketerId },
    });
    const phonenum = marketerPhoneNum.replace(/[^0-9]/g, '');

    const data = await axios
      .post(
        this.NAVER_CLOUD_SENS_URL + this.ALIM_TALK_SERVICE_URL,
        this.createMarketerCashBurnSendingData({ marketerName, phonenum }),
        { headers: sendingHeader },
      )
      .catch(err => {
        // 알림톡 실패 내역 저장.
        console.log(`err in alimtalk - ${marketerId} `, err.response.data.error);
        throw err;
      });

    // 알림톡 내역 저장. - kakaoAlimtalk 테이블.
    const { requestId, requestTime, statusCode, statusName, messages } = data.data; // 요청 데이터 추출

    const entities = messages.map((message: NaverCloudMessageResponse) => {
      return this.alimtalkRepo.create({
        requestId,
        requestTime,
        statusCode,
        statusName,
        messagesMessageId: message.messageId,
        messagesCountryCode: message.countryCode,
        messagesTo: message.to,
        messagesContent: message.content,
        messagesRequestStatusCode: message.requestStatusCode,
        messagesRequestStatusName: message.requestStatusName,
        messagesRequestStatusDesc: message.requestStatusDesc,
      });
    });
    await this.alimtalkRepo.save(entities);
    return 'successfully posted';
  }

  // ************************************
  // * Private methods
  // ************************************

  // * 광고주 캐시소진 알림톡 전송 데이터 생성 함수
  private createMarketerCashBurnSendingData({
    marketerName,
    phonenum,
  }: {
    marketerName: string;
    phonenum: string;
  }): NaverCloudSendingData {
    const TEMPLATE_CODE = 'onadcash1'; // cash burn template code
    const BUTTON_TYPE = 'WL'; // Web Link button type
    const BUTTON_NAME = '온애드에서 확인하세요'; // Button name
    const LINK_MOBILE = 'https://onad.io';
    const LINK_PC = 'https://onad.io';

    const TEMPLATE_CONTENT = `안녕하세요! ${marketerName} 님\nOnAD 광고캐시가 대부분 소진되었음을 알려드립니다. \n자세한 정보는 온애드에서 확인하세요.`;
    const sendingData = {
      templateCode: TEMPLATE_CODE,
      plusFriendId: this.PLUS_FRIEND_ID,
      messages: [
        {
          countryCode: this.COUNTRY_CODE_KR,
          to: phonenum, // marketer phone number
          content: TEMPLATE_CONTENT,
          buttons: [
            {
              type: BUTTON_TYPE,
              name: BUTTON_NAME,
              linkMobile: LINK_MOBILE,
              linkPc: LINK_PC,
            },
          ],
        },
      ],
    };
    return sendingData;
  }

  // * generate alimtalk hash signature
  private makeSignature(
    method = 'GET',
    url = '/photos/puppy.jpg?query1=&query2',
    nowtime = new Date().getTime().toString(),
  ) {
    const space = ' '; // one space
    const newLine = '\n'; // new line
    const timestamp = nowtime; // current timestamp (epoch)

    const accessKey = process.env.NAVER_CLOUD_ACCESS_KEY; // access key id
    const secretKey = process.env.NAVER_CLOUD_SECRET_KEY; // secret key

    if (!(accessKey && secretKey)) {
      throw Error('accesskey and secretkey is needed');
    }

    const hmac = Crypto.algo.HMAC.create(Crypto.algo.SHA256, secretKey);

    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp);
    hmac.update(newLine);
    hmac.update(accessKey);

    const hash = hmac.finalize();

    return hash.toString(Crypto.enc.Base64);
  }
}
