// 데이터 가공 함수가 위치할 것임.
// 데이터 가공함수에서의 오류는 모두 throw new Error('에러메시지') 로 처리함.
// 요청자에게는 500 에러 가 전송될 것임. (에러메시지는 develop 환경에서만 볼 수 있음.)
import { QueryResult } from '../../@types/db';
import doQuery from '../../model/doQuery';

interface PriorityData {
  campaignId: string;
  priorityType: any;
  priorityList: any[];
  optionType: number;
}

interface WithrawalList {
  date: string;
  creatorWithdrawalAmount: number;
  withdrawalState: number;
}

// 배열 인터페이스
interface Array<A, B> {
  length: number;
  [index: number]: A | B;
  map(arg: any): any
};


// 출금 내역에 대한 데이터 프로세싱
function withdrawalList(rawData: QueryResult): object {

  const rows: Array<string, number> = rawData.result;
  const columns: Array<string, number> = Object.keys(rows[0]).map(col =>
    col.replace('date', '출금날짜')
      .replace('creatorWithdrawalAmount', '출금금액')
      .replace('withdrawalState', '신청상태'));

  // dataset preprocessing
  const data: Array<string, number> = rows.map(
    (value: WithrawalList) => {
      const obj = [];
      obj.push(value.date.toLocaleString());
      obj.push(value.creatorWithdrawalAmount.toLocaleString());
      obj.push(value.withdrawalState === 0 ? '정산대기⏰' : '완료됨👌');
      return obj;
    }
  );
  return { columns, data };
}

/**
 * @description
  해당 캠페인의 생성시에 광고 타겟 선택유형에 맞게 DB에 저장하는 함수
  각 선택유형에 따른 캠페인 리스트가 JSON형태로 되어있기 때문에 해당 캠페인 리스트를 찾는 search query,
  캠페인 리스트 내부에 저장하는 insert query 2회 진행된다.

  - 크리에이터 선택형일 경우
      각 크리에이터의 계약된 캠페인 리스트 내부에 캠페인을 저장
  - 게임 선택형일 경우
      각 게임의 계약된 캠페인 리스트 내부에 캠페인을 저장
  - 무관일 경우
      쿼리실행을 하지 않는다.

 * @param {string} campaignId ? 해당 캠페인 ID
 * @param {string} priorityType ? 선택된 광고 타겟 유형
 * @param {string} optionType ? 선택된 광고 송출 유형
 * @param {array} priorityList ? 선택된 광고 타겟 ID 리스트(게임 ID 또는 크리에이터 ID) 
 * @method getSearchQuery ? 캠페인의 우선순위 유형에 맞는 캠페인 리스트를 가져오기 위한 query 설정 함수
 * @method getSaveQuery ? 캠페인의 우선순위 유형에 맞는 캠페인 리스트 내부에 저장하기 위한 query 설정 함수
 * @author 박찬우
 */
const PriorityDoquery = ({
  campaignId,
  priorityType,
  priorityList,
  optionType
}: PriorityData) => {

  const getSearchQuery = (type: string) => {
    switch (type) {
      case '0': {
        return 'SELECT campaignList FROM creatorCampaign WHERE creatorId = ?';
      }
      case '1': {
        return 'SELECT campaignList FROM categoryCampaign WHERE categoryName = ?';
      }
      case '2': {
        return 'SELECT campaignList FROM categoryCampaign WHERE categoryName = ?';
      }
      default: {
        return '';
      }
    }
  };

  const getSaveQuery = (type: string) => {
    switch (type) {
      case '0': {
        return `
          UPDATE creatorCampaign 
          SET campaignList = ? 
          WHERE creatorId = ?`;
      }
      case '1': {
        return `
          UPDATE categoryCampaign
          SET campaignList = ?
          WHERE categoryName = ?`;
      }
      case '2': {
        return `
          UPDATE categoryCampaign 
          SET campaignList = ?
          WHERE categoryName = ? `;
      }
      default: {
        return '';
      }
    }
  };

  const insertQuery = 'INSERT INTO categoryCampaign (categoryName, campaignList, state) VALUES(?, ?, 1)';
  const searchQuery = getSearchQuery(priorityType);
  const saveQuery = getSaveQuery(priorityType);

  if (optionType === 2) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  return Promise.all(
    priorityList.map(async (targetId: string) => new Promise((resolve, reject) => {
      doQuery(searchQuery, [targetId])
        .then((row) => {
          if (row.result.length === 0) {
            const newJsonData = JSON.stringify({ campaignList: [campaignId] });
            doQuery(insertQuery, [targetId, newJsonData])
              .then(() => {
                resolve();
              })
              .catch((errorData) => {
                console.log(errorData, '429');
                reject(errorData);
              });
          } else {
            const jsonData = JSON.parse(row.result[0].campaignList);
            const newCampaignList = jsonData.campaignList.concat(campaignId);
            jsonData.campaignList = newCampaignList;
            doQuery(saveQuery, [JSON.stringify(jsonData), targetId])
              .then(() => {
                resolve();
              })
              .catch((errorData) => {
                console.log(errorData);
                reject(errorData);
              });
          }
        })
        .catch((errorData) => {
          console.log(errorData, '447');
          reject(errorData);
        });
    }))
  );
};

/**
 * @description
  랜딩페이지 초기화를 위해서 현재 모든 계약된 크리에이터 리스트를 반환하는 함수.

 * @author 박찬우
 */
const getCreatorList = () => new Promise<string[]>((resolve, reject) => {
  const creatorSelectQuery = `
    SELECT creatorId
    FROM creatorInfo
    WHERE creatorContractionAgreement = 1
    `;
  doQuery(creatorSelectQuery, [])
    .then((row) => {
      const creatorList = row.result.map((data: any) => data.creatorId);
      resolve(creatorList);
    })
    .catch(() => {
      console.log('LandingDoQuery => getCreatorList');
      reject();
    });
});


/**
 * @description
  캠페인을 생성하는 시점에 랜딩페이지 초기화를 진행하는 함수
  priorityType : 배너 광고 우선순위 타입 ( 0: 크리에이터 우선형, 1: 카테고리 우선형 2: 노출 우선형)
  optionType : 캠페인의 광고타입 ( 0: CPM, 1: CPM + CPC, 2: CPC )

  - CPC이고 노출우선형일 경우에는 배너 광고 진행이 되지 않아 랜딩페이지에 초기화 되지 않으므로 모든 크리에이터의 랜딩페이지에 초기화
  - CPC이고 크리에이터 우선형일 경우에는 선택된 크리에이터의 랜딩페이지에 초기화
  - CPM일 경우에는 소켓에서 해당 배너 광고 진행시 크리에이터의 랜딩페이지에 초기화 진행됨.
  
 * @param {string} campaignId ? 해당 캠페인 ID
 * @param {string} optionType ? 선택된 광고 송출 유형
 * @param {string} priorityType ? 선택된 광고 타겟 유형
 * @param {array} priorityList ? 선택된 광고 타겟 ID 리스트(게임 ID 또는 크리에이터 ID) 
 * @author 박찬우
 */
const LandingDoQuery = async ({
  campaignId, optionType, priorityType, priorityList
}: PriorityData) => {
  const insertQuery = `
    INSERT INTO landingClick
    (campaignId, creatorId)
    VALUES (?, ?)
    `;

  const creatorList = await getCreatorList();

  // 모든 크리에이터에게 할당하기.
  if (optionType === 2 && priorityType === 2) {
    return Promise.all(
      creatorList.map(async (targetId: string) => new Promise((resolve, reject) => {
        doQuery(insertQuery, [campaignId, targetId])
          .then((row) => {
            resolve();
          })
          .catch((errorData) => {
            console.log(errorData, '470');
            reject(errorData);
          });
      }))
    );
  }

  // 주어지는 크리에이터 리스트에 대한 랜딩페이지 초기화
  if (optionType === 2) {
    return Promise.all(
      priorityList.map(async (targetId: string) => new Promise((resolve, reject) => {
        doQuery(insertQuery, [campaignId, targetId])
          .then((row) => {
            resolve();
          })
          .catch((errorData) => {
            console.log(errorData, '486');
            reject(errorData);
          });
      }))
    );
  }
};

/**
 * @description
  캠페인을  등록하기 위해서 가장 최근 생성된 캠페인의 이름을 가져온다.
  이름을 통해 다음 순번의 캠페인 이름을 생성하여 반환한다.
  
 * @param {string} marketerId ? 해당 마케터 ID
 * @author 박찬우
 */
const getCampaignId = (result: any, marketerId: string | undefined) => {
  let campaignId = '';
  if (result) {
    const lastCampaignId = result.campaignId;
    const count = parseInt(lastCampaignId.split('_c')[1], 10) + 1;
    if (count < 10) {
      campaignId = `${marketerId}_c0${count}`;
    } else {
      campaignId = `${marketerId}_c${count}`;
    }
  } else {
    campaignId = `${marketerId}_c01`;
  }
  return campaignId;
};

/**
 * @description
  배너URL을  등록하기 위해서 가장 최근 생성된 배너URL의 이름을 가져온다.
  이름을 통해 다음 순번의 배너URL 이름을 생성하여 반환한다.
  
 * @param {string} marketerId ? 해당 마케터 ID
 * @author 박찬우
 */
const getUrlId = (marketerId: string | undefined) => new Promise((resolve, reject) => {
  let urlId = '';
  const getLandingUrlQuery = `
    SELECT linkId
    FROM linkRegistered
    WHERE marketerId = ?
    ORDER BY linkId DESC
    LIMIT 1`;
  doQuery(getLandingUrlQuery, [marketerId])
    .then((row) => {
      if (row.result[0]) {
        const lastlinkId = row.result[0].linkId;
        const count = parseInt(lastlinkId.split('_')[2], 10) + 1;
        if (count < 10) {
          urlId = `${marketerId}_0${count}`;
          resolve(urlId);
        } else {
          urlId = `${marketerId}_${count}`;
          resolve(urlId);
        }
      } else {
        urlId = `${marketerId}_01`;
        resolve(urlId);
      }
    }).catch((err) => {
      reject();
      console.log(err, '535');
    });
});

export default {
  PriorityDoquery,
  LandingDoQuery,
  getCampaignId,
  getUrlId,
  withdrawalList
};
