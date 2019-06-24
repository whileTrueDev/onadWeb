// 캐쉬 환불 및 신청
const defaultCashData = {
  columns: [
    '날짜',
    '캐시충전',
    '캐시환불',
    '환불상태',
  ],
  data:
   [['-',
     '-',
     '-',
     '-']],
};

const defaultCash = {
  marketerDebit: '0',
  date: '충전내역이 없습니다'
}
export { defaultCashData, defaultCash };
