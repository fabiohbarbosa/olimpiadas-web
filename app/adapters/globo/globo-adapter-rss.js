import _ from 'lodash';
import cheerio from 'cheerio';

import { saveNews, adapterContents } from './globo-adapter-commons';
import { ParseRSS, ParseHTML } from '../../parser';
import { log, properties } from '../../utils';
import { News } from '../../news';

function rss() {
  log.debug('Starting RSS parse');
  let parse = new ParseRSS(properties.globo.rss);

  parse.start((posts) => {
    _.forEach(posts, (post) => {
      if (!post) return;

      let link = post.link;
      if (!link || link.indexOf('olimpiadas') <= 0) return;

      let title = post.title;
      if (!title) return;

      let body = adapterBody(post.description);
      if (!body) return;

      let pubDate = post.pubDate;
      if (!pubDate) return;

      let img = adapterImg(post.description);
      if (!img) return;

      adapterContents(link).then((data) => {
        let news = new News();
        news.link = link;
        news.title = title;
        news.body = body;
        news.pubDate = pubDate;
        news.img = img;
        news.type = 'RSS';
        news.contents = data;

        saveNews(news);
      }).error((err) => {
        log.error(err);
        log.error('Error to parse contents of ' + link);
      }).catch((err) => {
        log.error(err);
        log.error('Error to parse contents of ' + link);
      });
    });

  });
}

function adapterBody(description) {
  if (!description) return;

  let body = description;

  description = description.split('<br />');
  if (description.length === 2) {
    body = description[1];
  }
  return body;
}

function adapterImg(description) {
  if (!description) return;

  let $ = cheerio.load('<html>' + description + '</html>');
  let img = $('a').children().attr('src');

  if (!img) {
    img = properties.globo.defaultImg;
    log.debug('Image not found, save default');
  }
  return img;
}

exports.rss = rss;
