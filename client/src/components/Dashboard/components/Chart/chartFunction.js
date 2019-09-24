
/**
 * @description 오늘로부터 howMuch 만큼 이전의 날짜까지를 배열로 반환하는 함수.
 * @param {number} distance
 * @author hwasurr
 */
function datefy(dateObject) {
  if (typeof dateObject === 'string') {
    return dateObject.split('T')[0];
  }
  return `${dateObject.getMonth() + 1}월 ${dateObject.getDate()}일`;
}

/**
 * @param {*} dataPacket api 요청으로 받아온 데이터. 데이터형은 다음과 같다.
 * `[ { date: '09월 10일', cash: 9000, type: 'CPM' },
 *    {date: '09월 10일', cash: 9000, type: 'CPC'}, {}, ... ]`
 * @description StackedBar에 해당하는 데이터를 생성해주는 함수,
 * 데이터가 2주 미만으로 존재할 시, 빈 데이터를 채워준다.
 * @author hwasurr
 */
function createStackBarDataSet(dataPacket) {
  const DEFAULT_CASH = 0;
  const WEEK_LENGTH = 14;
  const CPM = []; const CPC = [];
  let days = [];

  dataPacket.forEach((obj, index) => {
    if (days.indexOf(datefy(obj.date)) === -1) { // 처음보는 date
      days.push(datefy(obj.date));

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
            CPC.push(DEFAULT_CASH);
          } else if (obj.type === 'CPC') {
            CPM.push(DEFAULT_CASH);
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

  days = days.map(day => `${day.split('-')[1]}월 ${day.split('-')[2]}일`);

  // 2주일의 데이터보다 적다면, 2주(14일)의 데이터만큼 day를 채운다.
  if (days.length < WEEK_LENGTH) {
    const lastTime = new Date(
      dataPacket[dataPacket.length - 1].date.split('T')[0]
    ); // 현재 날짜 수

    for (let i = WEEK_LENGTH - days.length; i > 0; i -= 1) {
      lastTime.setDate(lastTime.getDate() - 1);
      days.push(`${lastTime.getMonth() + 1}월 ${lastTime.getDate()}일`);
      // console.log('lastTime in days:', days[days.length - 1]);
    }
  }
  return { days, CPM, CPC };

  // const splited = obj.date.split('-');
  // days.push(`${splited[1]}월 ${splited[2].slice(0, 2)}일`);
}

module.exports = {
  createStackBarDataSet,
};
