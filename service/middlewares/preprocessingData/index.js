const pool = require('../../model/connectionPool');

/* 크리에이터 광고 내역 관련 함수 및 라우터 */
// 크리에이터 광고내역 전처리 함수
function preprocessingBannerData(result) {
  if (result) {
    // column preprocessing
    let columns = result[0];
    columns = Object.keys(columns);
    columns = columns.map((col) => {
      col = col.replace('bannerSrc', '배너')
        .replace('marketerName', '광고주')
        .replace('contractionTime', '계약일')
        .replace('contractionState', '현재 상태');
      return col;
    });
    columns.splice(-1, 1);

    const contractionIds = [];
    // dataset preprocessing
    result = result.map(
      (value) => {
        value.contractionState === 0 ? value.contractionState = '진행중' : value.contractionState = '완료됨';
        value.contractionTime = value.contractionTime.toLocaleString();
        contractionIds.push(value.contractionId);
        delete value.contractionId;

        value = Object.values(value);
        return value;
      }
    );
    return { columns, data: result, contractionIds };
  }
}

// 크리에이터 광고 출금 내역 전처리 함수
function withdrawalList(result) {
  if (result) {
    let columns = result[0];
    columns = Object.keys(columns);
    columns = columns.map((col) => {
      col = col.replace('date', '출금날짜')
        .replace('creatorWithdrawalAmount', '출금금액')
        .replace('withdrawalState', '신청상태');


      return col;
    });

    // dataset preprocessing
    result = result.map(
      (value) => {
        value.withdrawalState === 0 ? value.withdrawalState = '진행중' : value.withdrawalState = '완료됨';
        value.date = value.date.toLocaleString();
        value.creatorWithdrawalAmount = value.creatorWithdrawalAmount.toLocaleString();

        value = Object.values(value);
        return value;
      }
    );
    return { columns, data: result };
  }
}

// 마케터 캐시 충전 및 환불 내역 전처리 함수
function cashlist(result) {
  if (result) {
    let columns = result[0];
    columns = Object.keys(columns);
    columns = columns.map((col) => {
      col = col.replace('date', '날짜')
        .replace('chargeCash', '캐시충전')
        .replace('withdrawCash', '캐시환불')
        .replace('cashReturnState', '신청상태');


      return col;
    });

    // dataset preprocessing
    result = result.map(
      (value) => {
        if (value.chargeCash !== 0) {
          value.cashReturnState = '완료됨';
        } else {
          value.cashReturnState === 0 ? value.cashReturnState = '진행중' : value.cashReturnState = '완료됨';
        }
        value.date = value.date.toLocaleString();
        value.chargeCash = value.chargeCash.toLocaleString();
        value.withdrawCash = value.withdrawCash.toLocaleString();

        value = Object.values(value);
        return value;
      }
    );
    return { columns, data: result };
  }
}

// 마케터 대시보드에서 광고 될 크리에이터 목록에 들어가는 데이터 전처리 함수
function creatorList(result) {
  const data = result.map((row) => {
    row.streamPlatform = 'Twitch.tv';
    row.freqStreamCategory = 'Gaming';
    row.viewer = Math.ceil(row.avgViewer);
    row.cost = `${Math.ceil(row.viewer * 6)}원`;
    delete row.avgViewer;
    return Object.values(row);
  });

  return data;
}

module.exports = {
  preprocessingBannerData,
  withdrawalList,
  cashlist,
  creatorList
};
