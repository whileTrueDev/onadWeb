import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IamportTokenResponse {
  access_token: string;
  [key: string]: any;
}

export interface IamportPaymentResponse {
  amount: string;
  status: 'ready' | 'paid'; // ready, paid
  vbank_num: string;
  vbank_date: string;
  vbank_name: string;
  vbank_holder: string;
  [key: string]: any;
}

@Injectable()
export class IamportService {
  constructor(private readonly configService: ConfigService) {}
  public async getToken(): Promise<IamportTokenResponse> {
    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: this.configService.get<string>('IMP_KEY'), // REST API키 => import 관리자 페이지에 있음
        imp_secret: this.configService.get<string>('IMP_SECRET'), // REST API Secret => import 관리자 페이지에 있음
      },
    });
    return getToken.data.response; // 접속 인증 토큰
  }

  public async getPaymentData(
    impUid: string,
    accessToken: string,
  ): Promise<IamportPaymentResponse> {
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
      method: 'get',
      headers: { Authorization: accessToken }, // 인증 토큰 Authorization header에 추가
    });
    return getPaymentData.data.response;
  }
}
