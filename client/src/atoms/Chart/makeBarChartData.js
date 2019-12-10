function datefy(dd) {
  const year = dd.getFullYear();
  const month = `${dd.getMonth() + 1}`.padStart(2, 0);
  const day = `${dd.getDate()}`.padStart(2, 0);
  return `${year}-${month}-${day}`;
}

export default function makeBarChartData(arrayOfExposureData) {
  const KEY_CPM = 'cpm_amount'; const KEY_CPC = 'cpc_amount';
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

  previousDates.reduce((previousValue, currentValue, currentIndex, array) => {
    const previous = new Date(previousValue);
    const previousPlusOneDay = previous;
    previousPlusOneDay.setDate(previousPlusOneDay.getDate() - 1);
    const now = new Date(currentValue);
    const DAY_EQUAL = datefy(previous) === datefy(now);

    // if (currentIndex === previousDates.length - 1) {
    //   console.log(previousDates);
    //   console.log(dataSet.length);
    //   console.log(currentIndex, now);
    //   const emptyDate = datefy(now);
    //   if (dataSet.findIndex(d2 => d2.date === emptyDate) === -1) {
    //     // dataSet에 해당 날짜의 데이터가 없는 경우
    //     dataSet.splice(currentIndex + 1, 0, {
    //       cpc_amount: 0, date: emptyDate, cpm_amount: 0
    //     });
    //   } else {
    //     // console.log('날짜 데이터 있음 - ', dataSet[currentIndex]);
    //     // dataSet에 해당 날짜의 데이터가 있는 경우
    //     const keys = Object.keys(dataSet[currentIndex + 1]);
    //     if (!(keys.includes(KEY_CPC))) {
    //       dataSet[currentIndex + 1][KEY_CPC] = 0;
    //     }
    //     if (!(keys.includes(KEY_CPM))) {
    //       dataSet[currentIndex + 1][KEY_CPM] = 0;
    //     }
    //   }
    // }

    if (!DAY_EQUAL) {
      // 같지 않다면,
      const emptyDate = datefy(previous);
      if (dataSet.findIndex(d2 => d2.date === emptyDate) === -1) {
        // dataSet에 해당 날짜의 데이터가 없는 경우
        dataSet.splice(currentIndex, 0, {
          cpc_amount: 0, date: emptyDate, cpm_amount: 0
        });
      } else {
        // console.log('날짜 데이터 있음 - ', dataSet[currentIndex]);
        // dataSet에 해당 날짜의 데이터가 있는 경우
        const keys = Object.keys(dataSet[currentIndex]);
        if (!(keys.includes(KEY_CPC))) {
          dataSet[currentIndex][KEY_CPC] = 0;
        }
        if (!(keys.includes(KEY_CPM))) {
          dataSet[currentIndex][KEY_CPM] = 0;
        }
      }
    }
    return previousPlusOneDay;
  });

  return dataSet.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}
