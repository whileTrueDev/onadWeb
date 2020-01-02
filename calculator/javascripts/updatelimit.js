const schedule = require('node-schedule');
const doQuery = require('../model/calculatorQuery');

const calculation = () => {
  const updateQuery = `
  UPDATE campaign
  SET limitState = 0
  `;
  doQuery(updateQuery, []);
};

const scheduler = schedule.scheduleJob('0 * * *', () => {
  calculation();
});

module.exports = scheduler;
