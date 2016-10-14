import { log, properties } from '../../utils';
import { ParseHTML } from '../../parser';
import { Logging } from '../../logging';

function saveNews(news) {
  if (!news) return;

  news.credit = properties.globo.credit;
  log.info('Save ' + news.type + ' ' + news.link);

  news.save((err) => {
    if (err && err.code === 11000) {
      log.debug('News ' + news.link + ' already exists');
      return;
    }
    if (err) {
      log.error('Error to save news');
      log.error(news);
      log.error(err);
      return;
    }
    log.info('Save ' + news.type + ' ' + news.link);
  });
}

const DEFAULT_PAGE = '.corpo-conteudo';
const GLOBO_PLAY = '.player-mount';

function adapterContents(news) {
  let parse = new ParseHTML();
  let link = news.link;
  let contents;

  parse.start(link, ($) => {
    if (!$) return;

    // executor 1
    if ($(DEFAULT_PAGE).length) {
      log.debug('Found default page to ' + link);
      contents = contentsDefaultPage($);
      if (!contents) saveLogging(link);
    } else if ($(GLOBO_PLAY).length) {
      log.debug('Found globo play page to ' + link);
      // contents = contentsGloboPlay($);
      if (!contents) saveLogging(link);
    } else {
      saveLogging(link);
    }
    return;
    news.contents = contents
    saveNews(news);
  });
}

import phantom from 'phantom';
function contentsGloboPlay($) {

  phantom.create().then(function(ph) {
    ph.createPage().then(function(page) {
      page.open('http://globoplay.globo.com/v/5214312/').then(function(status) {
        page.property('content').then(function(content) {
          console.log(content);
          page.close();
          ph.exit();
        });
      });
    });
  });
}

function contentsDefaultPage($) {
  let contents = [];
  let count = 0;

  // subtitle
  let subtitle = $('h2[itemprop="description"]').text();
  contents.push({
    subtitle: subtitle,
    order: count++
  });

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
  return contents;
}

function saveLogging(link) {
  log.error('Error to parse contents of ' + link);
  new Logging({
    link: link,
    msg: 'Error to parse contents'
  }).save();
}

exports.saveNews = saveNews;
exports.adapterContents = adapterContents;
