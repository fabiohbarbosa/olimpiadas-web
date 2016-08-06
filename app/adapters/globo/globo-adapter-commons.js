import { log, properties } from '../../utils';
import { ParseHTML } from '../../parser';

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

function adapterContents(news) {
  let parse = new ParseHTML();
  let link = news.link;
  parse.start(link, ($) => {
    if (!$) return;

    // executor 1
    if ($(DEFAULT_PAGE).length) {
      log.debug('Found default page to ' + link);
      news.contents = contentsDefaultPage($);
      saveNews(news);
      return;
    }
    log.error('Error to parse contents of ' + link);
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
    log.error('Parse element ' + element.name);
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


exports.saveNews = saveNews;
exports.adapterContents = adapterContents;
