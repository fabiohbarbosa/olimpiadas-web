import HttpStatus from 'http-status-codes';
import {log} from '../utils';

import News from '../news/model';

module.exports = (router) => {
  log.debug('Support API loaded');

  log.debug('Mapped GET /fix-date');
  router.get('/support/fix-date', fixDate);
};

function fixDate(req, res, next) {  // eslint-disable-line no-unused-vars
  News.find(function(data) {
    console.log(data);
  });
}
