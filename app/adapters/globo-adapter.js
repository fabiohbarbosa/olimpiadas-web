import _ from 'lodash';
import cheerio from 'cheerio';

import {
  ParseRSS,
  ParseHTML
} from '../parser';

import {
  log,
  properties
} from '../utils';

import News from '../news/model';

exports.rss = () => {
  log.info('Starting RSS parse');

  let rss = new ParseRSS(properties.globo.rss);

  rss.start((posts) => {
    _.forEach(posts, (post) => {
      if (!post) return;

      let link = post.link;
      if (!link || link.indexOf('olimpiadas') <= 0) return;

      let title = post.title;
      if (!title) return;

      let body = adapterBody(post.description);
      if (!body) return;

      let img = adapterImg(post.description);
      if (!img) return;

      let news = new News();
      news._id = link;
      news.title = title;
      news.body = body;
      news.img = img;
      news.type = 'RSS';

      saveNews(news, 'RSS');
    });
  });

  function adapterBody(description) {
    if (!description) return;

    let body = {};

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

};

exports.html = () => {
  log.info('Starting HTML parse');
  for (let i = 1; i <= properties.globo.htmlPages; i++) {
    parseHtml(properties.globo.html + '&page=' + i);
  }

  function parseHtml(url) {
    log.debug('Parsing ' + url);
    let html = new ParseHTML(url);
    html.start((posts) => {
      if (!posts) return;

      let $ = cheerio.load(posts);

      $('.resultado_da_busca').contents().each((index, element) => {

        let materiaPadrao = $(element).children('.specie-content')
          .children('.busca-materia-padrao');

        // title
        let title = materiaPadrao.children('.busca-titulo')
          .attr('title');
        if (!title) return;

        // body
        let body = materiaPadrao.children().last()
          .children('.busca-highlight').text();
        if (!body) return;
        body = body.trim().replace("\n", "");

        //link
        let link = materiaPadrao.children().last()
          .children('.busca-link-url').attr('href');
        if (!link) return;

        link = adapterLink(link);

        // img
        let img = materiaPadrao.children().last()
          .children('.busca-link-url').children().attr('src');
        if (!img) return;

        let news = new News();
        news._id = link;
        news.title = title;
        news.body = body;
        news.img = img;
        news.type = 'HTML';

        saveNews(news, 'HTML');
      });
    });
  }

  function adapterLink(link) {
    let ahref = link.split('&u=');
    if (!ahref || ahref.length <= 0) {
      return;
    }

    ahref = ahref[1].split('&');
    if (!ahref) {
      return;
    }
    return decodeURIComponent(ahref[0]);
  }
};

function saveNews(news, type) {
  news.save(function(err) {
    if (err && err.code === 11000) {
      log.debug('News ' + news._id + ' already exists');
      return;
    }
    if (err) {
      log.error(err);
      return;
    }
    log.info('Save ' + type + ' ' + news._id);
  });
}
