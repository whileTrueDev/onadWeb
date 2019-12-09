export default function makeBarChartData(arrayOfExposureData) {
  const dataSet = [];
  const previousDates = [];
  arrayOfExposureData.map((d) => {
    const data = {};
    // date 검사

    // 이전 날짜와 비교
    if (!(previousDates.includes(d.date))) {
      // 이전 날짜 목록에 포함되어 있지 않은 경우
      // 이전 날짜 목록에 추가
      previousDates.push(d.date);

      // CPM의 경우
      if (d.type === 'CPM') {
        data.cpm_amount = d.cash;
      } else if (d.type === 'CPC') {
        // CPC의 경우
        data.cpc_amount = d.cash;
      }
      data.date = d.date;

      dataSet.push(data);
    } else {
      // 이전 날짜 목록에 포함되어 있는 경우
      // 해당 날짜의 결과데이터 찾기
      const targetObject = dataSet.filter(d1 => d1.date === d.date)[0];

      // 결과 데이터에 CPM, CPC 중 없는 값 추가
      if (d.type === 'CPM') {
        targetObject.cpm_amount = d.cash;
      } else if (d.type === 'CPC') {
        targetObject.cpc_amount = d.cash;
      }

      // 결과데이터 배열에서 해당 날짜의 결과데이터의 인덱스 찾기
      dataSet[dataSet.findIndex(i => i.date === d.date)] = targetObject;
    }

    return null;
  });

  return dataSet;
}
