import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CertificationInfo } from './interfaces/certificationInfo.interface';
import { CertificationRes } from './interfaces/certificationRes.interface';

@Injectable()
export class CertService {
  constructor(private readonly configService: ConfigService) {}

  private getIamportToken() {
    return axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
      data: {
        imp_key: this.configService.get<string>('IMP_KEY'), // REST API키
        imp_secret: this.configService.get<string>('IMP_SECRET'), // REST API Secret
      },
    });
  }

  private getCertification(impUid: string, accessToken: string) {
    return axios({
      url: `https://api.iamport.kr/certifications/${impUid}`, // imp_uid 전달
      method: 'get', // GET method
      headers: { Authorization: accessToken }, // 인증 토큰 Authorization header에 추가
    });
  }

  public async certificate(impUid: string): Promise<CertificationRes> {
    try {
      // 인증 토큰 발급 받기
      const getToken = await this.getIamportToken();
      const { access_token: accessToken } = getToken.data.response; // 인증 토큰

      // imp_uid로 인증 정보 조회
      const getCertifications = await this.getCertification(impUid, accessToken);
      const certificationsInfo = getCertifications.data.response as CertificationInfo; // 조회한 인증 정보

      // 인증정보에 대한 데이터를 저장하거나 사용한다.
      const { birth } = certificationsInfo;

      const date = new Date(birth);
      const now = new Date();
      now.setFullYear(now.getFullYear() - 19);

      const minor = now < date;
      return { error: false, data: { minor } };
    } catch (e) {
      console.error('Error during - iamport certification: ', e);
      return { error: true, data: { msg: '서버오류입니다. 잠시후 다시 진행해주세요.' } };
    }
  }
}
