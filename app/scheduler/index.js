import {log} from '../utils/';

import schedule from 'node-schedule';
import {globoAdapter} from '../adapters';
import {fixDate} from '../support';

exports.start = () => {
  log.debug('Scheduling start');
  globo();
  support();
};

function globo() {
  log.debug('Scheduling globo adapter');
  // 10 minutos
  // */10 * * * *

  // 10 segundos
  // */10 * * * * *
  schedule.scheduleJob('*/10 * * * * *', function() {
    globoAdapter.rss();
    globoAdapter.html();
  });
}

function support() {
  log.debug('Scheduling support');
  schedule.scheduleJob('*/1 * * * *', function() {
    fixDate();
  });
}
