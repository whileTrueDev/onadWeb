import scheduler from 'node-schedule';

export default class OnAdScheduler {
  readonly name: string;

  constructor(
    name: string,
    rule: string | number | Date
          | scheduler.RecurrenceRule
          | scheduler.RecurrenceSpecDateRange
          | scheduler.RecurrenceSpecObjLit,
    jobCallback: scheduler.JobCallback
  ) {
    this.name = name;
    scheduler.scheduleJob(name, rule, jobCallback);
  }
}
