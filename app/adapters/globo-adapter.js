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

exports.rss = () => {
  let rss = new ParseRSS(properties.globo.rss);

  rss.start((posts) => {
    _.forEach(posts, (post) => {
      if (!post) return;

      let title = post.title;
      if (!title) return;

      let link = adapterLink(post.description);
      if (!link) return;

      let news = {
        title: title,
        link: link
      };

      log.debug(news);
    });
  });

  function adapterLink(description) {
    if (!description) return;

    // split a href
    let ahref = description.split("href=\'")[1];
    if (!ahref || !ahref.length > 0) return;

    // split url
    let link = ahref.split("'")[0];
    if (!link) return;

    // ignora se nao for notifcia de olimpiadas
    if (link.indexOf('olimpiadas') <= 0) return;
    return link;
  }

};

exports.html = () => {
  let html = new ParseHTML(properties.globo.html);
  html.start((posts) => {
    let $ = cheerio.load(posts);

    $('.resultado_da_busca').contents().each((index, element) => {
      // title
      let title = $(element).children('.specie-content')
        .children('.busca-materia-padrao')
        .children('.busca-titulo').attr('title');
      if (!title) return;

      //link
      let link = $(element).children('.specie-content')
        .children('.busca-materia-padrao')
        .children().last()
        .children('.busca-link-url').attr('href');
      if (!link) return;

      link = linkAdapter(link);

      let news = {
        title: title,
        link: link
      };
      log.debug(news);
    });
  });
};

function linkAdapter(link) {
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
