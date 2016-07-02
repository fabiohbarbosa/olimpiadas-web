import _ from 'lodash';
import cheerio from 'cheerio';

import ParseRSS from '../modules/parse-rss';
import ParseHTML from '../modules/parse-html';
import {log} from '../utils';

exports.rss = () => {
  let rss = new ParseRSS('http://globoesporte.globo.com/servico/semantica/editorias/plantao/feed.rss');
  rss.start((posts) => {
    _.forEach(posts, (post) => {
      if (!post || !post.description) {
        return;
      }
      // split a href
      let ahref = post.description.split("href=\'")[1];
      if (!ahref || !ahref.length > 0) {
        return;
      }
      // split url
      let url = ahref.split("'")[0];
      if (!url) {
        return;
      }
      // ignora se nao for notifcia de olimpiadas
      if (url.indexOf('olimpiadas') <= 0) {
        return
      }
      // TODO save URL
      log.debug('Found url:')
      log.debug(url);
    });
  });
};

exports.html = () => {
  let html = new ParseHTML('http://globoesporte.globo.com/busca/?q=olimpiadas&st=globoesporte');
  html.start((posts) => {
    let $ = cheerio.load(posts);

    $('.resultado_da_busca').contents().each((i, element) => {
      // title
      let title = $(this).children('.specie-content')
        .children('.busca-materia-padrao')
        .children('.busca-titulo').text();
      if (!title) return;

      // body
      let body = $(this).children('.specie-content')
        .children('.busca-materia-padrao')
        .children().last()
        .children('.busca-highlight').text();
      if (!body) return;
      body = body.trim().replace("\n", "");

      //link
      let link = $(this).children('.specie-content')
        .children('.busca-materia-padrao')
        .children().last()
        .children('.busca-link-url').attr('href');
      if (!link) return;

      // TODO tratar data

      link = linkAdapter(link);

      let news = {
        title: title,
        body: body,
        link: link
      }
      // console.log(news);
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
