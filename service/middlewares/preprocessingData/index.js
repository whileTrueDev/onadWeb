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

module.exports = {
  sortRows,
  preprocessingBannerData,
}

