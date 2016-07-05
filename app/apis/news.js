import HttpStatus from 'http-status-codes';

import {log} from '../utils';
import News from '../news/model';

module.exports = (router) => {
  log.debug('News API loaded');

  log.debug('Mapped GET /news');
  router.get('/news', findAll);
};

function findAll(req, res, next) {
  News.find({}, function(err, data) {
    if (err) {
      log.error(err);
      next(err);
      return;
    }
    res.status(HttpStatus.OK).json(data);
  });
}
