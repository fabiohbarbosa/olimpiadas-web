import {log} from '../utils/';

import schedule from 'node-schedule';
import {globoAdapter} from '../adapters';

exports.start = () => {
  log.debug('Scheduling start');
  globoScheduling();
};

function globoScheduling() {
  log.debug('Scheduling globo adapter');
  schedule.scheduleJob('*/2 * * * * *', function() {
    globoAdapter.rss();
    // globoAdapter.html();
  });
}
