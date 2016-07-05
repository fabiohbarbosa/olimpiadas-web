import {log} from '../utils/';

import schedule from 'node-schedule';
import {globoAdapter} from '../adapters';

exports.start = () => {
  log.debug('Scheduling start');
  globoScheduling();
};

function globoScheduling() {
  log.debug('Scheduling globo adapter');
  // 10 minutos
  // */10 * * * *

  // 10 segundos
  // */10 * * * * *
  schedule.scheduleJob('*/5 * * * *', function() {
    globoAdapter.rss();
    globoAdapter.html();
  });
}
