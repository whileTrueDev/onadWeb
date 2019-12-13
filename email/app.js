require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const schedule = require('node-schedule');
const dateCheck = require('./model/checkLastLogin');
const mailer = require('./model/mailer');
const emailArray = require('./model/getEmail');

const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
const year = today.getFullYear();
const todayDate = `${year}-${month}-${day}`;
const zeroIdArray = [];
const monthIdArray = [];

let todayDateFormat;
let lastDateFormat;
let diffTime;
let diffDay;
let mailAdr;
let dDay;
console.log('mailer ON');

async function getDateList() {
  const lastDate = await dateCheck();
  return lastDate;
}

async function calculateDate() {
  console.log('날짜계산시작');
  return getDateList().then((result) => {
    todayDateFormat = new Date(todayDate);
    result.map((value, index) => {
      lastDateFormat = new Date(result[index].date.toISOString().split('T')[0]);
      diffTime = todayDateFormat - lastDateFormat;
      diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      dDay = '2019-01-13';
      if (diffDay === 336) {
        monthIdArray.push(value.userId);
      }
      console.log('날짜 계산 끝');
    });
    return { monthId: monthIdArray };
  });
}

function getMail(userId) {
  return new Promise((async (resolve, reject) => {
    mailAdr = await emailArray(userId);
    resolve(mailAdr);
  }));
}

async function mailSend() {
  const getList = await calculateDate();
  if (getList.monthId.length !== 0) {
    getList.monthId.map((marketerId) => {
      console.log(`${marketerId} 메일전송`);
      getMail(marketerId).then(() => {
        mailer(mailAdr[0].marketerMail, marketerId, dDay);
        console.log(`${marketerId} 휴면예정 전송완료`);
      });
    });
  }
}

mailSend();
