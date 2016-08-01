import HttpStatus from 'http-status-codes';

import { log } from '../utils';
import { News, NewsRequest } from '../news';
import ErrorException from '../exceptions/error-exception';

module.exports = (router) => {
  log.debug('News API loaded');

  // deprecated
  log.debug('Mapped GET /news');
  router.get('/news', findAll);

  log.debug('Mapped GET /news/pageable');
  router.get('/news/pageable', pageable);
};

function findAll(req, res) {
  log.debug('Find /news');
  News.find({}, (err, data) => {
    if (err) {
      log.error(err);
      return;
    }
    res.status(HttpStatus.OK).json(data);
  });
}

function pageable(req, res) {
  log.debug('Find /news/pageable');
  let query = req.query;
  let newsReq = new NewsRequest(query.limit, query.pubDate, query.type);

  try {
    log.debug(newsReq);
    newsReq.validate();

    let q;
    if (newsReq.isPrevious()) {
      log.debug('Previous pageable');
      q = News.find({pubDate: {$lte: newsReq.pubDate} });
    }
    if (newsReq.isNext()) {
      log.debug('Next pageable');
      q = News.find({pubDate: {$gte: newsReq.pubDate} });
    }

    q.sort({ pubDate: -1 }).limit(newsReq.limit);
    q.exec((err, data) => {
      if (err) {
        catchException(err);
        return;
      }
      if (!data || data.length === 0) {
        res.status(HttpStatus.NO_CONTENT).send();
        return;
      }

      let firstDate = data[0].pubDate;
      let lastDate = data[data.length - 1].pubDate;

      let serverUrl = req.protocol + '://' + req.get('host') + '/api/news/pageable?limit=' + newsReq.limit + '&pubDate=';

      NewsRequest.hateoas(serverUrl, firstDate, lastDate, (previousUrl, nextUrl) => {
        let news = {
          'previous': previousUrl,
          'next': nextUrl,
          'data': data
        }
        res.status(HttpStatus.OK).json(news);
      });
    });

  } catch (e) {
    catchException(e);
  }

  function catchException(err) {
    if (typeof err !== 'ErrorException') {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "INTERNAL SERVER ERROR: '" + err.message + "'"});
      return;
    }
    err.printStacktrace();
    res.status(e.status).json({ message: err.message });
  }
}
