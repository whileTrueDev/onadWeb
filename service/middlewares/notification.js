const doQuery = require('../model/doQuery');
// const logger = require('./calculatorLogger');
const CustomDate = require('./customDate');

// userType : 마케터인가 크리에이터인가
// type : 현재 어떠한 상황의 메세지인가 => 해당 값을 통해 messeage dictionary에서 꺼내 사용한다.
// targetId : 보낼 대상은 누구인가?
// ex) 예시
// Notification({
//   userType: 'creator', type: 'settle', targetId: '173919802', params: { creatorWithdrawalAmount: 30000 }
// });

const messageDict = {
  marketer: {
    readyTorunOut: {
      selectQuery: `
      SELECT mi.marketerName, md.cashAmount 
      FROM marketerInfo as mi JOIN marketerDebit as md 
      ON mi.marketerId = md.marketerId 
      WHERE mi.marketerId = ? 
      ORDER BY md.date DESC LIMIT 1`,
      getTitle: ({ marketerName }) => `${marketerName}님,  광고캐시가 거의 다 소진되었습니다.`,
      getMessage: ({ marketerName, date, cashAmount }) => `${marketerName}님의 남은 광고캐시는 ${date} 기준 ${cashAmount}원 입니다.
      광고 캐시가 소진될 시 광고가 자동으로 내려갑니다.
      계속 광고를 하기 원하신다면 소진되기 전에 충전해주세요.
      `
    },
    runOut: {
      selectQuery: `
      SELECT marketerName
      FROM marketerInfo
      WHERE marketerId = ? 
     `,
      getTitle: ({ marketerName }) => `${marketerName}님, 광고캐시가 모두 소진되었습니다.`,
      getMessage: ({ date }) => `${date} 이후 모든 광고가 자동으로 OFF 상태가 되었습니다.
      광고를 다시 시작하시려면 광고 캐시 충전 후 광고 상태를 ON으로 바꿔주시기 바랍니다.`
    },
    bannerRegistered: {
      selectQuery: `
      SELECT marketerName
      FROM marketerInfo
      WHERE marketerId = ? 
     `,
      getTitle: ({ marketerName }) => `${marketerName}님, 배너가 승인되었습니다.`,
      getMessage: ({ marketerName }) => `${marketerName}님이 등록하신 배너가 관리자의 승인을 받았습니다.`
    },
    bannerDinied: {
      selectQuery: `
      SELECT marketerName
      FROM marketerInfo
      WHERE marketerId = ? 
     `,
      getTitle: ({ marketerName }) => `${marketerName}님, 배너가 승인이 거절되었습니다.`,
      getMessage: ({ marketerName, bannerDenialReason }) => `${marketerName}님이 등록하신 배너가 관리자에 의해 승인이 거절되었습니다.
      거절사유는 ${bannerDenialReason} 입니다.
      배너관리에서 거절사유를 확인하세요.`
    },
    billPublished: {
      selectQuery: `
      SELECT marketerName
      FROM marketerInfo
      WHERE marketerId = ? 
     `,
      getTitle: ({ marketerName }) => `${marketerName}님, 세금 계산서가 발행되었습니다.`,
      getMessage: ({ marketerName }) => `${marketerName}님이 신청하신 세금 계산서가 발행되었습니다.
      마이 오피스에서 확인하세요.`
    },
    vbankChargeReady: {
      selectQuery: `
      SELECT marketerName , (SELECT DATE_FORMAT(FROM_UNIXTIME(vbankDueDate, "%Y-%m-%d %h:%i:%s"), "%Y-%m-%d %h:%i:%s")) AS date
      FROM marketerInfo AS mI
      LEFT JOIN marketerCharge AS mC
      ON mC.marketerId = ?
      WHERE mI.marketerId = mC.marketerId
     `
     ,
      getTitle: ({ marketerName }) => `${marketerName}님, 가상계좌 발급이 완료되었습니다.`,
      getMessage: ({ marketerName, cashAmount, date, vbankName, vbankNum }) => `${marketerName}님, ${vbankName} ${vbankNum}으로 ${date}까지 ${cashAmount}원을 입금해주세요.
      `,
    },
    vbankChargeComplete: {
      selectQuery: `
      SELECT marketerName
      FROM marketerInfo
      WHERE marketerId = ? 
     `,
      getTitle: ({ marketerName }) => `${marketerName}님, 가상계좌 결제가 완료되었습니다.`,
      getMessage: ({ marketerName, cashAmount }) => `${marketerName}님, 가상계좌 결제가 완료되어 ONAD캐시 ${cashAmount}원이 충전되었습니다.
      `,
    }
  },
  creator: {
    settle: {
      selectQuery: `
      SELECT creatorName, creatorAccountNumber
      FROM creatorInfo
      WHERE creatorId = ?`,
      getTitle: ({ creatorName }) => `${creatorName}님, 광고비가 정산되었습니다.`,
      getMessage: ({ creatorName, creatorAccountNumber, creatorWithdrawalAmount }) => `${creatorName}님의 신청하신 ${creatorWithdrawalAmount}원이 ${creatorAccountNumber}으로 입금되었습니다.
      정산에 문제가 있는 경우 온애드 고객 센터로 문의 주시기 바랍니다.`
    },
    levelUp: {
      selectQuery: `
      SELECT creatorName
      FROM creatorInfo
      WHERE creatorId = ?`,
      getTitle: ({ creatorName }) => `${creatorName}님, 광고 페이지 레벨이 올랐습니다.`,
      getMessage: ({ creatorName, level }) => `${creatorName}님의 광고 페이지 레벨이 ${level}이 되었습니다.
      레벨이 높아질수록 광고 매칭 및 광고비 책정시 도움이 됩니다.`
    }
  }
};

// 개인 알림 함수.
const Notification = async ({
  userType, type, targetId, params
}) => {
  // 날짜 수집.
  const dateCode = new Date().toLocaleString();
  const { selectQuery, getTitle, getMessage } = messageDict[userType][type];

  // 일단 해당 target의 기본정보 및 개인알림 등록에 필요한 데이터 수집.
  const row = await doQuery(selectQuery, [targetId]);
  const data = { ...row.result[0], date: dateCode, ...params};
  const title = getTitle(data);
  const message = getMessage(data);
  const sendQuery = userType === 'creator'
    ? `INSERT INTO creatorNotification
  (creatorId,  title, content) 
  VALUES (?, ?, ?)`
    : `INSERT INTO marketerNotification
  (marketerId, title, content) 
  VALUES (?, ?, ?)`;
  return doQuery(sendQuery, [targetId, title, message]);
};

module.exports = Notification;
