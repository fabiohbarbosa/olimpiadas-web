import _ from 'lodash';

import { log } from '../utils';
import { ParseHTML, dateHTML } from '../parser';
import News from '../news/model';

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

function fixDate() {
  let query = {
    $or: [{
      fixed: {
        $exists: false
      },
      fixed: null
    }]
  };

  News.find(query).limit(10).exec((err, news) => {
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

    let parse = new ParseHTML(n.link + '/');

    parse.start(($) => {
      if (!$) return;

      //chain
      // first executor
      let dateTime = $('.published').children('time').text();
      if (!dateTime) {
        log.debug('Date default not found for ' + n.link);
        log.debug('Next execution...');
        blogBrasil();
        return;
      }

      log.debug('Updating ' + n.link + ' from globo esporte default');
      updateNews(dateTime);
      return;

      function blogBrasil() {
        dateTime = $('time[itemprop="datePublished"]').text().trim();
        if (!dateTime) {
          log.debug('Date Blog Brasil not found for ' + n.link);
          log.debug('Next execution...');
          videoFix();
          return;
        }

        dateTime = dateTime.split(', ');
        if (dateTime.length !== 2) {
          log.debug('Date Blog Brasil not found for ' + n.link);
          log.debug('Next execution...');
          videoFix();
          return;
        }
        log.debug('Updating ' + n.link + ' from blog brasil');
        updateNews(dateTime[1]);
      }

      function videoFix() {
        dateTime = $('time[itemprop="datePublished"]').attr('datetime');
        if (!dateTime) {
          log.debug('Video date not found for ' + n.link);
          log.debug('Next execution...');
          notFoundFix();
          return;
        }
        log.debug('Updating ' + n.link + ' from video fix');
        updateNews(dateTime);
      }

      function notFoundFix() {
        n.fixed = true;
        n.save((err) => {
          if (err) {
            log.error(n);
            log.error(err);
            return;
          }
          log.info(n.link + ' not updated');
        });
      }

      function updateNews(pubDate) {
        n.pubDate = dateHTML(pubDate);
        n.fixed = true;
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
exports.fixDate = fixDate;
exports.fixLink = fixLink;
