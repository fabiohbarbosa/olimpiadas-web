import moment from 'moment';

import { adapterContents } from './globo-adapter-commons';
import { ParseHTML, dateHTML } from '../../parser';
import { log, properties } from '../../utils';
import { News } from '../../news';

function html() {
  log.debug('Starting HTML parse');
  for (let i = 1; i <= properties.globo.htmlPages; i++) {
    parseHtml(properties.globo.html + '&page=' + i);
  }
}

function parseHtml(url) {
  log.debug('Parsing ' + url);
  let parse = new ParseHTML();

  parse.start(url, ($) => {
    if (!$) return;

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

      // pub date
      let dateTxt = materiaPadrao.children('.busca-editorial')
        .children('.busca-tempo-decorrido').text();

      if (!dateTxt) return;

      let pubDate = {};
      try {
        if (dateTxt.indexOf('há') <= 0) {
          pubDate = dateHTML(dateTxt);
        } else {
          pubDate = dateHTML(dateTxt, new Date());
        }
      } catch (err) {
        log.error(dateTxt);
        log.error(err);
        return;
      }

      if (!pubDate) return;

      let momentPubDate = moment(pubDate);
      // random milliseconds
      if (momentPubDate.get('milliseconds') === 0) {
        momentPubDate.add(Math.floor(Math.random() * 1000), 'milliseconds');
      }
      pubDate = momentPubDate.toDate();

      //link
      let link = materiaPadrao.children().last()
        .children('.busca-link-url').attr('href');
      if (!link) return;

      link = adapterLink(link);
      if (!link) return;

      // img
      let img = materiaPadrao.children().last()
        .children('.busca-link-url').children().attr('src');
      if (!img) return;

      let news = new News();
      news.link = link;
      news.title = title;
      news.body = body;
      news.pubDate = pubDate;
      news.img = img;
      news.type = 'HTML';

      adapterContents(news);
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
  if (ahref.indexOf('eptv') >= 0) {
    return;
  }
  return decodeURIComponent(ahref[0]);
}

exports.html = html;
