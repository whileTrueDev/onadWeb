const pool = require('../../model/connectionPool');

// 시간순으로 최신으로 정렬하는 함수
function sortRows(rows, sortingValue, orderBy='desc') {
  const sortingField = sortingValue;
  if (orderBy === 'desc') {
    return rows.sort((a, b) => (b[sortingField] - a[sortingField]))
  } else {
    return rows.sort((a, b) => (a[sortingField] - b[sortingField]))
  }
};

/* 크리에이터 광고 내역 관련 함수 및 라우터 */
// 크리에이터 광고내역 전처리 함수
function preprocessingBannerData(result) {
  if (result) {
    // column preprocessing
    let columns = result[0];
    columns = Object.keys(columns);
    columns = columns.map((col) => {
      col = col.replace("bannerSrc", "배너")
        .replace("marketerName", "광고주")
        .replace("contractionTime", "첫 게시일")
        .replace("contractionState", "현재 상태")

      return col;
    });

    // dataset preprocessing
    result = result.map(
    (value) => {
      value.contractionState === 0 ? value.contractionState = "진행중" : value.contractionState = "완료됨";
      value.contractionTime = value.contractionTime.toLocaleString();

      value = Object.values(value);
      return value
    }
  );
  return {columns: columns, data: result}
  }
}

function withdrawalList(result) {
  if (result) {

    let columns = result[0];
    columns = Object.keys(columns);
    columns = columns.map((col) => {
      col = col.replace("date", "출금날짜")
        .replace("creatorWithdrawalAmount", "출금금액")
        .replace("withdrawalState", "출금상태")


      return col;
    });

    // dataset preprocessing
    result = result.map(
    (value) => {
      value.withdrawalState === 0 ? value.withdrawalState = "진행중" : value.withdrawalState = "완료됨";
      value.date = value.date.toLocaleString();
      value.creatorWithdrawalAmount = value.creatorWithdrawalAmount.toLocaleString();

      value = Object.values(value);
      return value
    }
  );
  return {columns: columns, data: result}
  }
}


function cashlist(result) {
  if (result) {

    let columns = result[0];
    columns = Object.keys(columns);
    columns = columns.map((col) => {
      col = col.replace("date", "날짜")
        .replace("chargeCash", "캐시충전")
        .replace("withdrawCash", "캐시환불")
        .replace("cashReturnState", "환불상태")


      return col;
    });

    // dataset preprocessing
    result = result.map(
    (value) => {
      if (value.chargeCash !== 0) {
        value.cashReturnState = "완료됨"
      } else {
        value.cashReturnState === 0 ? value.cashReturnState = "진행중" : value.cashReturnState = "완료됨";
      }
      value.date = value.date.toLocaleString();
      value.chargeCash = value.chargeCash.toLocaleString();
      value.withdrawCash = value.withdrawCash.toLocaleString();

      value = Object.values(value);
      return value
    }
  );
  return {columns: columns, data: result}
  }
}

module.exports = {
  sortRows,
  preprocessingBannerData,
  withdrawalList,
  cashlist
}

