import schedule from 'node-schedule';

import {globoAdapter} from '../adapters';
import {nodeEnv, properties, log} from '../utils';


exports.start = () => {
  if (!properties[nodeEnv].scheduler) {
    log.debug('Scheduling disabled');
    return;
  }
  log.debug('Scheduling start');
  globo();
};

function globo() {
  log.debug('Scheduling globo adapter');
  // 10 minutos
  // */10 * * * *

  // 10 segundos
  // */10 * * * * *
  schedule.scheduleJob('*/1 * * * *', function() {
    globoAdapter.rss();
    globoAdapter.html();
  });
}
