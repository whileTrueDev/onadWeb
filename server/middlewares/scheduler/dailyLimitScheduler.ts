import doQuery from '../../model/doQuery';

const schedule = require('node-schedule');

function calculation() {
  const updateQuery = `
  UPDATE campaign
  SET limitState = 0
  `;
  doQuery(updateQuery, []);
}

// 매 일 0시에 (한도 초과 아님 상태)0 으로 변경.
const scheduler = schedule.scheduleJob('Marketer CampaignLimitState update scheduler', '0 * * *', () => {
  calculation();
});

export default scheduler;
