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
  // let query = {
  //   link: { $not: /.*.globoplay.*/ }
  //   $or: [{
  //     fixed: {
  //       $exists: false
  //     },
  //     fixed: null
  //   }]
  // };

  let query = {
    link: /.*.globoplay.*/,
    $or: [{
      fixed: {
        $exists: false
      },
      fixed: null // eslint-disable-line no-dupe-keys
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

    let parse = new ParseHTML(n.link);

    parse.start(($) => {
      if (!$) return;

      // chain
      // executor 1
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

      // executor 2
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

      // executor 3
      function videoFix() {
        dateTime = $('time[itemprop="datePublished"]').attr('datetime');
        if (!dateTime) {
          log.debug('Video date not found for ' + n.link);
          log.debug('Next execution...');
          globoPlay();
          return;
        }
        log.debug('Updating ' + n.link + ' from video fix');
        updateNews(dateTime);
      }

      function globoPlay() {
        dateTime = $('meta[itemprop="datePublished"]').attr('content');

        if (!dateTime) {
          log.debug('Globo play date not found for ' + n.link);
          log.debug('Next execution...');
          notFoundFix();
          return;
        }
        log.debug('Updating ' + n.link + ' from globoplay fix');
        updateNews(dateTime);
      }

      // executor 4
      function notFoundFix() {
        n.fixed = true;
        n.save((err) => {
          if (err) {
            log.error(n);
            log.error(err);
            return;
          }
          log.error(n.link + ' not updated');
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
