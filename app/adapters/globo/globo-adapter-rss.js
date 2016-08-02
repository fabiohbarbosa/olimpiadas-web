import _ from 'lodash';
import cheerio from 'cheerio';

import { saveNews } from './globo-adapter-commons';
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

      let fullBody = adapterFullBody(post.link);
      if (!fullBody) {
        log.debug('Error to parse full body of ' + link);
        return;
      }

      let news = new News();
      news.link = link;
      news.title = title;
      news.body = body;
      news.pubDate = pubDate;
      news.img = img;
      news.type = 'RSS';

      saveNews(news);
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

const DEFAULT_PAGE = '.corpo-conteudo';

function adapterFullBody(link) {
  let parse = new ParseHTML();
  parse.start(link, ($) => {
    if (!$) return;

    // executor 1
    if ($(DEFAULT_PAGE).length) {
      fullBodyDefaultPage($);
    }
  });
}

function fullBodyDefaultPage($) {
  // foto componente-conteudo
  let contents = [];
  let count = 0;

  $(DEFAULT_PAGE).contents().each((index, element) => {
    let content = {};

    // text
    if (element.name === 'p') {
      let text = $(element).text();
      if (text) {
        content.text = text.replace(/\r?\n|\r/g, " ").trim();
      }
    }

    // image
    if (element.name === 'div' && $(element).attr('class')) {
      // src
      let src = $(element).children().attr('src');

      // ception
      let text = $(element).text();
      let caption;
      if (text) {
        caption = text.replace(/\r?\n|\r/g, " ").trim();
      }

      if (src && caption) {
        content.image = {
          src: src,
          caption: caption
        };
      }
    }

    if (content) {
      content.order = count++;
      contents.push(content);
    }
  });
  /*
  _.forEach(fullBody, (full) => {
    console.log(full);
    console.log('\n');
  });
  */
  let news = new News();

  news.contents = contents;
  news.pubDate = new Date();
  news.type = 'RSS';

  saveNews(news);

}

exports.rss = rss;

adapterFullBody("http://globoesporte.globo.com/am/noticia/2016/06/inscricoes-para-voluntariado-na-olimpiada-no-am-sao-prorrogadas.html");
