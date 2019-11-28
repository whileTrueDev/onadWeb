
/** **********************************************
 * ***************** 보조 함수 *********************
 * *********************************************** */

/**
  * @description 날짜간의 차이를 반환하는 함수
  * @param {Date} date1 날짜 차이를 구할 기준
  * @param {Date} date2 타겟 날짜
  * @returns {Number} 날짜차이
  * @author hwasurr
  */
function dateDiff(date1, date2) {
  if (date1 instanceof Date && date2 instanceof Date) {
    return Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
  }
  return null;
}

/**
  * @description 날짜간의 월의 차이를 반환하는 함수
  * @param {Date} date1 월 차이를 구할 기준
  * @param {Date} date2 타겟 날짜
  * @returns {Number} 월 차이
  * @author hwasurr
  */
function monthDiff(date1, date2) {
  let strTermCnt = 0;
  // 년도가 같으면 단순히 월을 마이너스 한다.
  // => 20090301-20090201 의 경우(윤달이 있는 경우) 아래 else의 로직으로는 정상적인 1이 리턴되지 않는다.
  if (date2.getFullYear() === date1.getFullYear()) {
    strTermCnt = date1.getMonth() * 1 - date2.getMonth() * 1;
  } else {
    strTermCnt = Math.round((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24 * 365 / 12));
  }
  return strTermCnt;
}


/**
 * @description 날짜를 문자열로 변환하는 함수
 * @param {number} distance
 * @return {String} "%m월 %d일" 에 따르는 날짜 문자열
 * @author hwasurr
 */
function datefy(dateObject) {
  if (typeof dateObject === 'string') {
    return dateObject.split(' ')[0];
  }
  return `${dateObject.getMonth() + 1}월 ${dateObject.getDate()}일`;
}

/**
 * @description 데이터를 셋업하는 함수
 * @param {array} dataPacket 로부터 api 서버로부터 넘겨받은 데이터.
 * @param {function} dateDiffFunc 두 날짜간의 사이를 구할 함수 ( dateDiff or monthDiff )
 * @author hwasurr
 */
function setUpData(dataPacket, dateDiffFunc) {
  const DEFAULT_VALUE = 0;
  const CPM = []; const CPC = [];
  const setUpLabels = [];

  dataPacket.forEach((obj, index) => {
    if (setUpLabels.indexOf(datefy(obj.date)) === -1) { // 처음보는 date
      if (setUpLabels.length >= 1) {
        const previousDate = setUpLabels[setUpLabels.length - 1];
        const currentDate = datefy(obj.date);
        const datediff = dateDiffFunc(new Date(previousDate), new Date(currentDate));

        // 앞의날짜와 지금날짜의 날짜차이가 있다면 ( 빈 데이터가 존재한다면 )
        if (datediff > 1) {
          const emptyDate = new Date(previousDate);
          console.log(datediff);
          for (let i = 1; i < datediff; i += 1) {
            // 빠진 날짜만큼 반복
            emptyDate.setDate(emptyDate.getDate() - 1);

            console.log(emptyDate.toISOString());
            setUpLabels.push(emptyDate.toISOString().split('T')[0]);
            CPM.push(DEFAULT_VALUE);
            CPC.push(DEFAULT_VALUE);
          }
        }
      }

      setUpLabels.push(datefy(obj.date));


      if (obj.type === 'CPM') {
        CPM.push(obj.cash);
      } else if (obj.type === 'CPC') {
        CPC.push(obj.cash);
      }

      // 다음 데이터 중, 지금의 날짜가 없으면
      if (index !== dataPacket.length) {
        if (!dataPacket[index + 1]
            || datefy(dataPacket[index + 1].date)
            !== datefy(obj.date)) {
          if (obj.type === 'CPM') {
            CPC.push(DEFAULT_VALUE);
          } else if (obj.type === 'CPC') {
            CPM.push(DEFAULT_VALUE);
          }
        }
      }
      // 이미 돌았던 date
    } else if (obj.type === 'CPM') {
      CPM.push(obj.cash);
    } else {
      CPC.push(obj.cash);
    }
  });
  return { setUpLabels, CPM, CPC };
}


/** ************************************************
 * ***************** 실 사용 함수 *********************
 * *********************************************** */
/**
 * @param {[ {}, {}, ]} dataPacket api 요청으로 받아온 데이터. 데이터형은 다음과 같다.
 * `[ { date: '09월 10일', cash: 9000, type: 'CPM' },
 *    {date: '09월 10일', cash: 9000, type: 'CPC'}, {}, ... ]`
 * @description StackedBar에 해당하는 데이터를 생성해주는 함수, 데이터가 15일 미만으로 존재할 시, 빈 데이터를 채워준다.
 * @author hwasurr
 */
function createStackBarDataSet(dataPacket, DATE_RANGE = 15) {
  const today = new Date();
  if (dataPacket.length > 0) {
    const { setUpLabels, CPM, CPC } = setUpData(dataPacket, dateDiff);


    const labels = setUpLabels.map(day => `${day.split('-')[1]}월 ${day.split('-')[2]}일`);
    const firstTime = new Date(dataPacket[0].date.split('T')[0]); // 마지막 날짜
    const lastTime = new Date(dataPacket[dataPacket.length - 1].date.split('T')[0]); // 현재 날짜 수

    // 오늘과 today, firstTime 사이의 빈 데이터가 있는경우 채운다.
    if (dateDiff(today, firstTime) > 0) {
      // 날짜 차이 만큼 앞에 데이터를 추가한다.
      for (let i = dateDiff(today, firstTime); i > 1; i -= 1) {
        firstTime.setDate(firstTime.getDate() + 1);
        labels.unshift(datefy(firstTime));
        CPM.unshift(0);
        CPC.unshift(0);
      }
    }

    // 2주일의 데이터보다 적다면, 한달(30일)의 데이터만큼 day를 채운다.
    if (labels.length < DATE_RANGE) {
      for (let i = DATE_RANGE - labels.length; i > 0; i -= 1) {
        lastTime.setDate(lastTime.getDate() - 1);
        labels.push(`${lastTime.getMonth() + 1}월 ${lastTime.getDate()}일`);
      }
    }
    return { labels, CPM, CPC };
  }
  const labels = []; const CPM = []; const CPC = [];
  for (let i = DATE_RANGE; i > 0; i -= 1) {
    today.setDate(today.getDate() - 1);
    labels.push(`${today.getMonth() + 1}월 ${today.getDate()}일`);
    CPM.push(0);
    CPC.push(0);
  }

  return { labels, CPC, CPM };
}


/**
 * @description 월별 데이터를 받아와 차트용 데이터로 전처리하는 함수.
 * @param { [ {}, {}, ...] }  dataPacket DB로부터 가져온 데이터
 * @author hwasurr
 */
function createStackBarDataSetPerMonth(dataPacket) {
  const MONTH_LENGTH = 12;
  const today = new Date();
  if (dataPacket.length > 0) {
    const { setUpLabels, CPM, CPC } = setUpData(dataPacket, monthDiff);

    const labels = setUpLabels.map(day => `${day.split('-')[0]}년 ${day.split('-')[1]}월`);
    const firstTime = new Date(dataPacket[0].date.split('T')[0]); // 처음 날짜
    const lastTime = new Date(dataPacket[dataPacket.length - 1].date.split('T')[0]); // 마지막 날짜

    // 오늘과 today, firstTime 사이의 빈 데이터가 있는경우 채운다.
    if (monthDiff(today, firstTime) > 0) {
    // 날짜 차이 만큼 앞에 데이터를 추가한다.
      for (let i = monthDiff(today, firstTime); i > 0; i -= 1) {
        labels.unshift(`${today.getFullYear()}년 ${today.getMonth() + 1}월`);
        CPM.unshift(0);
        CPC.unshift(0);
        today.setMonth(today.getMonth() + 1);
      }
    }

    // 2주일의 데이터보다 적다면, 2주(14일)의 데이터만큼 day를 채운다.
    if (labels.length < MONTH_LENGTH) {
      for (let i = MONTH_LENGTH - labels.length; i > 0; i -= 1) {
        lastTime.setMonth(lastTime.getMonth() - 1);
        labels.push(`${lastTime.getFullYear()}년 ${lastTime.getMonth() + 1}월`);
      }
    }

    return { labels, CPM, CPC };
  }

  const labels = []; const CPM = []; const CPC = [];
  for (let i = MONTH_LENGTH; i > 0; i -= 1) {
    today.setDate(today.getDate() - 1);
    labels.push(`${today.getMonth() + 1}월 ${today.getDate()}일`);
    CPM.push(0);
    CPC.push(0);
  }
  return { labels, CPC, CPM };
}


module.exports = {
  createStackBarDataSet,
  createStackBarDataSetPerMonth
};
