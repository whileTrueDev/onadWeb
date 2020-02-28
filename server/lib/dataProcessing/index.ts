// 데이터 가공 함수가 위치할 것임.
// 데이터 가공함수에서의 오류는 모두 throw new Error('에러메시지') 로 처리함.
// 요청자에게는 500 에러 가 전송될 것임. (에러메시지는 develop 환경에서만 볼 수 있음.)

import { QueryResult } from '../../@types/db';
import express from 'express';
import doQuery from '../../model/doQuery';

interface PriorityData {
  campaignId: string;
  priorityType: any,
  priorityList: any[],
  optionType: number,
}


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

  // 노출우선형일 경우, priorityList가 모든 creator에 해당되어야함.
};

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

// optionType == 2이면 랜딩페이지를 초기화하지 않는다.
// optionType === 1이면 노출우선형일때는 모든 크리에이터에게
// 크리에이터 우선형일때는 priorityList에 대해 초기화한다.

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

// 예시함수.
function someDataProcessingFunction(rawData: QueryResult): QueryResult {
  const err = false; // 예시를 위해 에러를 무조건 나도록
  if (err) {
    throw new Error('여기서 에러가 났어요');
  }
  return rawData;
}

export default {
  someDataProcessingFunction,
  PriorityDoquery,
  LandingDoQuery,
  getCampaignId,
  getUrlId
};
