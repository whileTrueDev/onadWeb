function datefy(dd) {
  const year = dd.getFullYear();
  const month = `${dd.getMonth() + 1}`.padStart(2, 0);
  const day = `${dd.getDate()}`.padStart(2, 0);
  return `${year}-${month}-${day}`;
}

export default function makeBarChartData(arrayOfExposureData, howMuchDate = 30) {
  const KEY_CPM = 'cpm_amount'; const KEY_CPC = 'cpc_amount';
  const dataSet = [];
  const previousDates = [];

  // 데이터가 있고, 데이터를 담은 배열의 길이가 1개보다 많을 때.
  if (arrayOfExposureData && arrayOfExposureData.length > 0) {
    // 데이터 형 변환
    arrayOfExposureData.map((d) => {
      const data = {}; // date 검사

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

    // 중간중간 비어있는 날짜에 기본 데이터 삽입
    previousDates.reduce((previousValue, currentValue, currentIndex, array) => {
      const previous = new Date(previousValue);
      const previousPlusOneDay = previous;
      previousPlusOneDay.setDate(previousPlusOneDay.getDate() - 1);
      const now = new Date(currentValue);
      const DAY_EQUAL = datefy(previous) === datefy(now);

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

    if (previousDates.length < howMuchDate) {
      const sortedDates = previousDates.sort((a, b) => (a - b));
      const farthest = sortedDates[previousDates.length - 1];

      const farthestDay = new Date(farthest);
      // 14일 있다 -> 16일 필요하다.
      // farthest는 14일.

      for (let i = howMuchDate - previousDates.length; i > 0; i -= 1) {
        // howMuchDate - 14 만큼 반복하며 하루씩 빼고, 0,0의 데이터를 넣어준다.
        farthestDay.setDate(farthestDay.getDate() - 1);
        dataSet.push({ date: datefy(farthestDay), cpc_amount: 0, cpm_amount: 0 });
      }
    }

    // 제일 최신의 데이터가 today보다 이전의 날짜인 경우
    // 비는 날짜만큼 기본 데이터 추가
    const newestDate = new Date(previousDates[0]);
    if (newestDate < new Date()) {
      // console.log(newestDate, '최신 데이터가 오늘날짜보다 이전이에요');
      const today = new Date();

      const betweenDay = Math.floor((today.getTime() - newestDate.getTime()) / 1000 / 60 / 60 / 24);

      for (let i = 0; i < betweenDay; i += 1) {
        newestDate.setDate(newestDate.getDate() + 1);
        dataSet.push({ date: datefy(newestDate), cpc_amount: 0, cpm_amount: 0 });
      }
    }


    return dataSet.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
  }

  // 데이터가 없는 경우
  const now = new Date();
  for (let i = 0; i < howMuchDate; i += 1) {
    dataSet.push({
      date: datefy(now),
      cpm_amount: 0,
      cpc_amount: 0
    });
    now.setDate(now.getDate() - 1);
  }
  return dataSet.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  });
}