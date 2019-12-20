const scheduler = require('node-schedule');

module.exports = class OnAdScheduler {
  constructor(name, rule, jobCallback) {
    this.name = name;
    scheduler.scheduleJob(name, rule, jobCallback);
  }
};
