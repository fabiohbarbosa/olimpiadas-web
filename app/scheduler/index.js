import schedule from 'node-schedule';

import { fixDate, fixDuplicationDate } from '../support';
import { globoAdapter } from '../adapters';
import { nodeEnv, properties, log } from '../utils';

let scheduler = properties[nodeEnv].scheduler;
exports.start = () => {
  if (!scheduler.enabled) {
    log.debug('Scheduling disabled');
    return;
  }
  log.debug('Scheduling start');
  globo();
};

function globo() {
  log.debug('Scheduling globo adapter');
  schedule.scheduleJob(scheduler.cron, () => {
    globoAdapter.rss();
    globoAdapter.html();
  });
}
