require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const schedule = require('node-schedule');
const dateCheck = require('./model/checkLastLogin');
const mailer = require('./model/mailer');
const emailArray = require('./model/getEmail');
const separator = require('./model/separator');
const doDelete = require('./model/doDelete');

const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
const year = today.getFullYear();
const todayDate = `${year}-${month}-${day}`;
const deleteIdArray = [];
const monthIdArray = [];

let todayDateFormat;
let lastDateFormat;
let diffTime;
let diffDay;
let mailAdr;
let dDay;

console.log(`${todayDate} mailer ON`);

async function getDateList() {
  const lastDate = await dateCheck();
  return lastDate;
}

function dateDivider(result, index) {
  lastDateFormat = new Date(result[index].date.toISOString().split('T')[0]);
  diffTime = todayDateFormat - lastDateFormat;
  diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDay;
}

async function CalculateDateMail() {
  console.log(`${todayDate} 휴면 메일 날짜 계산 시작`);
  return getDateList().then((result) => {
    todayDateFormat = new Date(todayDate);
    result.map((value, index) => {
      diffDay = dateDivider(result, index);
      dDay = '2019-01-13';
      if (diffDay === 335) {
        monthIdArray.push(value.userId);
      }
    });
    console.log('휴면 메일 날짜 계산 끝');
    return { monthId: monthIdArray };
  });
}

async function CalculateDateDB() {
  console.log(`${todayDate} 데이터 분리를 위한 날짜 계산`);
  return getDateList().then((result) => {
    todayDateFormat = new Date(todayDate);
    result.map((value, index) => {
      diffDay = dateDivider(result, index);
      if (diffDay === 365) {
        deleteIdArray.push(value.userId);
      }
    });
    console.log('분리 날짜 계산 끝');
    console.log(`분리대상 : ${deleteIdArray}`);
    return { deleteId: deleteIdArray };
  });
}

async function doMoveData() {
  const toMove = await CalculateDateDB();
  if (toMove.deleteId.length !== 0) {
    toMove.deleteId.map((marketerId) => {
      console.log(`${marketerId} 데이터 분리 / 삭제`);
      separator(marketerId)
        .then(() => { doDelete(marketerId); })
        .catch((err) => { console.log(err); });
    });
  }
}

function getMail(userId) {
  return new Promise((async (resolve, reject) => {
    mailAdr = await emailArray(userId);
    resolve(mailAdr);
  }));
}

async function mailSend() {
  const getList = await CalculateDateMail();
  if (getList.monthId.length !== 0) {
    getList.monthId.map((marketerId) => {
      console.log(`휴면 대상 : ${marketerId} 메일전송`);
      getMail(marketerId).then(() => {
        mailer(mailAdr[0].marketerMail, marketerId, dDay);
        console.log(`${marketerId} 휴면예정 전송완료`);
      });
    });
  }
}

function doDailyCheck() {
  mailSend();
  doMoveData();
}
const rule = new schedule.RecurrenceRule(); // 스케쥴러 객체 생성
rule.hour = 0; // cronTask 시간지정
const cronTask = schedule.scheduleJob(rule, () => {
  doDailyCheck();
});
