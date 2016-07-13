import HttpStatus from 'http-status-codes';
import moment from 'moment';

import {log} from '../utils';
import News from '../news/model';

module.exports = (router) => {
  log.debug('News API loaded');

  log.debug('Mapped GET /news');
  router.get('/news', findAll);

  log.debug('Mapped GET /news/pageable');
  router.get('/news/pageable', pageable);
};

function findAll(req, res, next) {
  News.find({}, (err, data) => {
    if (err) {
      log.error(err);
      next(err);
      return;
    }
    res.status(HttpStatus.OK).json(data);
  });
}

function pageable(req, res, next) {
  if (!req.query.limit) {
    res.status(HttpStatus.BAD_REQUEST).send();
    return;
  }
  let date = new moment().toDate();
  if (!req.query.date) {
    // TODO pegar data
  }
  let limit = parseInt(req.query.limit, 0);

  let q = News.find({ pubDate: { $lte: new Date() }}).sort({ pubDate: -1 }).limit(limit);
  q.exec((err, data) => {
    if (err) {
      log.error(err);
      next(err);
      return;
    }
    res.status(HttpStatus.OK).json(data);
  });
}
