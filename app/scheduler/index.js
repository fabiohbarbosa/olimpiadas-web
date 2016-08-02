import schedule from 'node-schedule';

import { fixDate, fixDuplicationDate } from '../support';
import { globoAdapter } from '../adapters';
import { nodeEnv, properties, log } from '../utils';

exports.start = () => {
  if (!properties[nodeEnv].scheduler) {
    log.debug('Scheduling disabled');
    return;
  }
  log.debug('Scheduling start');
  globo();
  // support();
};

function globo() {
  log.debug('Scheduling globo adapter');
  // 10 minutos
  // */10 * * * *

  // 10 segundos
  // */10 * * * * *
  schedule.scheduleJob('*/10 * * * * *', function() {
    globoAdapter.rss();
    // globoAdapter.html();
  });
}

function support() { // eslint-disable-line no-unsed-vars
  log.debug('Scheduling support');
  schedule.scheduleJob('*/5 * * * * *', function() {
    fixDuplicationDate();
    // fixDate();
  });
}
