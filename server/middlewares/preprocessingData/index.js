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
        value.contractionState === 0 ? value.contractionState = '정산대기⌛️' : value.contractionState = '완료됨👌';
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
  const rows = result;
  const columns = Object.keys(rows[0]).map(col => col.replace('date', '출금날짜')
    .replace('creatorWithdrawalAmount', '출금금액')
    .replace('withdrawalState', '신청상태'));

  // dataset preprocessing
  const data = rows.map(
    (value) => {
      const obj = [];
      obj.push(value.date.toLocaleString());
      obj.push(value.creatorWithdrawalAmount.toLocaleString());
      obj.push(value.withdrawalState === 0 ? '정산대기⏰' : '완료됨👌');
      return obj;
    }
  );
  return { columns, data };
}

// 마케터 대시보드에서 광고 될 크리에이터 목록에 들어가는 데이터 전처리 함수
function creatorList(result) {
  const data = result.forEach((row) => {
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
  creatorList
};
