import axios from 'axios';
import { Connection } from 'typeorm';
import { AdPickData } from './AdPickTypes';
import AdPickCampaign from '../../entity/AdPick.entity';

type AdPickDataList = Array<AdPickData>;
export default class AdPick {
  apiUrl: string;

  constructor() {
    this.apiUrl = 'https://adpick.co.kr/apis/offers.php';
  }

  /**
   * 요청 파라미터 설명
   * @param affid : 파트너 아이디 (필수)
   * @param os : ios (iOS 캠페인) 또는 android (Android 캠페인) [생략가능, 생략한 경우 API가 호출된 OS기기에 맞는 캠페인이 자동조회]
   * @param category : game (게임앱) 또는 notgame (비게임앱) [생략가능, 생략한 경우 전체 캠페인]
   * @param order : rand (랜덤 순서) 또는 randone (랜덤으로 1개의 캠페인) [생략가능, 생략한 경우 최신순]
   */
  getData = async (
    os?: string, category?: string, order?: string
  ): Promise<AdPickDataList> => {
    const row = await axios.get<AdPickDataList>(this.apiUrl, {
      params: {
        affid: process.env.ADPICK_AFF_ID,
        os,
        category,
        order,
      }
    });
    return row.data;
  }

  insertData = async (
    connection: Connection, data: AdPickDataList
  ): Promise<void> => {
    console.info('data insert start!! - ', data.length);

    // Insert logic
    const processedData = data
      // .filter((dd) => dd.apType !== '1') // 1 = 앱 설치형
      .map((d) => ({
        ...d,
        apPayout: d.apPayout ? Number(d.apPayout) : 0,
        apIOSPayout: d.apIOSPayout ? Number(d.apIOSPayout) : 0,
      }));

    // save 메소드는 하나의 transaction 상에서 작동
    // primarykey 기준으로 이미 있으면 update, 없으면 insert
    const result = await connection.manager.save(AdPickCampaign, processedData);
    console.info(`Successfully insert ${result.length} itmes`);
  }
}
