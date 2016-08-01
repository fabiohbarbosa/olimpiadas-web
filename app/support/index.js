import _ from 'lodash';
import moment from 'moment';

import { log } from '../utils';
import { ParseHTML, dateHTML } from '../parser';
import { News } from '../news';

/* Corrigir link das notícias com vídeo */
function fixLink() {
  let query = {
    link: { $not: /.*.html.*/ }
  };

  News.find(query, (err, news) => {
    if (err) return;
    if (!news) {
      log.info('Not found news');
      return;
    }
    log.info('Found ' + news.length + ' news');
    _.forEach(news, parseLink);
  });

  function parseLink(n) {
    n.link = n.link.split('/http://')[0];
    n.fixed = true;

    n.save((err) => {
      if (err) {
        log.error(n);
        log.error(err);
        return;
      }
      log.info('Change link to ' + n.link);
    });
  }
}

function fixDuplicationDate() {
  News.aggregate([
    {
      "$group": {
        _id: "$pubDate",
        count: {
          $sum: 1
        }
      }
    }, {
      "$match": {
        count: {
          $gt: 1
        }
      }
    }
  ], function(err1, result) {
    _.forEach(result, (r) => {
      News.findOne({ pubDate: moment(r._id).toDate() }).limit(1).exec((err2, news) => {
        let newPubDate = moment(news.pubDate);
        newPubDate.add(Math.floor(Math.random() * 1000), 'milliseconds');

        news.pubDate = newPubDate.toDate();
        news.save((err3) => {
          if (err3) {
            log.error(news);
            log.error(err3);
            return;
          }
          log.info(news.link + ' updated');
        });
      })
    })
  });
}

function fixDate() {
  let query = {
    fixed: true
  };

  News.find(query).limit(20).exec((err, news) => {
    if (err) return;
    if (!news) {
      log.debug('Not found news');
      return;
    }
    log.debug('Found ' + news.length + ' news');
    _.forEach(news, parseDate);
  });

  function parseDate(n) {
    if (!n || !n.link) {
      log.debug('Link not found!');
      return;
    }

    let parse = new ParseHTML();

    parse.start(n.link, ($) => {
      if (!$) {
        log.error('Html parse error!');
        return;
      }

      videoFix();

      function videoFix() {
        let dateTime = $('time[itemprop="datePublished"]').attr('datetime');
        if (!dateTime) dateTime = $('meta[itemprop="datePublished"]').attr('content');

        if (!dateTime) {
          log.error('Video date not found for ' + n.link);
          log.debug('Next execution...');
          return;
        }
        log.debug('Updating ' + n.link + ' from video fix');
        updateNews(dateTime);
      }

      function updateNews(pubDate) {
        n.pubDate = dateHTML(pubDate);
        n.fixed = false;
        n.save((err) => {
          if (err) {
            log.error(n);
            log.error(err);
            return;
          }
          log.info(n.link + ' updated');
        });
      }

    });
  }
}
exports.fixDuplicationDate = fixDuplicationDate;
exports.fixDate = fixDate;
exports.fixLink = fixLink;
