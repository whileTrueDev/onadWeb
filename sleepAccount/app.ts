/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.

import checkLastLogin from './models/checkLastLogin';
import mailer from './models/mailer';
import getEmail from './models/getEmail';
import separator from './models/separator';
import doDelete from './models/doDelete';

const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
const year = today.getFullYear();
const todayDate = `${year}-${month}-${day}`;
const deleteIdArray: string[] = [];
const monthIdArray: string[] = [];

let diffDay: number;
let diffTime;

interface MailAdr {
  marketerMail: string;
}

interface LoginRecord {
  userId: string;
  date: string;
}

interface MonthIdArray {
  monthId: string[];
}

interface DeleteIdArray {
  deleteId: string[];
}

console.log(`${todayDate} mailer ON`);

async function getDateList(): Promise<LoginRecord[]> {
  const lastDate = await checkLastLogin();
  return lastDate;
}

function dateDivider(date: any): Promise<number> {
  const todayDateFormat = new Date(todayDate);
  const lastDateFormat = new Date(date.date.toISOString().split('T')[0]);
  return new Promise((resolve, reject) => {
    diffTime = todayDateFormat.getTime() - lastDateFormat.getTime();
    diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    resolve(diffDay);
  });
}

async function CalculateDateMail(ids: any[]): Promise<MonthIdArray> {
  console.log(`${todayDate} 휴면 메일 날짜 계산 시작`);
  ids.map(async (value: LoginRecord) => {
    diffDay = await dateDivider(value);
    if (diffDay === 335) {
      monthIdArray.push(value.userId);
    }
  });
  console.log('휴면 메일 날짜 계산 끝');
  return { monthId: monthIdArray };
}

async function CalculateDateDB(ids: any[]): Promise<DeleteIdArray> {
  console.log(`${todayDate} 데이터 분리를 위한 날짜 계산`);
  ids.map(async (value: any) => {
    diffDay = await dateDivider(value);
    if (diffDay === 365) {
      deleteIdArray.push(value.userId);
    }
  });
  if (deleteIdArray.length !== 0) {
    console.log(`분리대상 : ${deleteIdArray}`);
    console.log('분리 날짜 계산 끝');
  }
  console.log('분리 대상 없음');
  return { deleteId: deleteIdArray };
}

async function doMoveData(ids: any[]): Promise<void> {
  const toMove = await CalculateDateDB(ids);
  if (toMove.deleteId.length !== 0) {
    toMove.deleteId.map((marketerId) => {
      console.log(`${marketerId} 데이터 분리 / 삭제`);
      separator(marketerId)
        .then(() => { doDelete(marketerId); })
        .catch((err) => { console.log(err); });
    });
  }
}

async function getMail(userId: string): Promise<MailAdr> {
  const mailAdr = await getEmail(userId);
  return mailAdr;
}

async function mailSend(ids: any[]): Promise<void> {
  const getList = await CalculateDateMail(ids);
  const dDay = `${year}-${month + 1}-${day}`;

  if (getList.monthId.length !== 0) {
    getList.monthId.map((marketerId) => {
      console.log(`휴면 대상 : ${marketerId} 메일전송`);
      getMail(marketerId).then((data) => {
        mailer(data.marketerMail, marketerId, dDay);
        console.log(`${marketerId} 휴면예정 전송완료`);
      });
    });
  }
}

async function doDailyCheck(): Promise<void> {
  const doGetDateListArray = await getDateList();
  mailSend(doGetDateListArray);
  doMoveData(doGetDateListArray);
}

doDailyCheck();
