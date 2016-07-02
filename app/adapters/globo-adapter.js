var ParseRSS = require('../modules/parse-rss');
var ParseHTML = require('../modules/parse-html');

var _ = require('lodash');
var cheerio = require("cheerio");

exports.rss = function() {
  var rss = new ParseRSS('http://globoesporte.globo.com/servico/semantica/editorias/plantao/feed.rss');
  rss.start(function(posts) {
    _.forEach(posts, function(post) {
      if (!post || !post.description) {
        return;
      }
      // split a href
      var ahref = post.description.split("href=\'")[1];
      if (!ahref || !ahref.length > 0) {
        return;
      }
      // split url
      var url = ahref.split("'")[0];
      if (!url) {
        return;
      }
      // ignora se nao for notifcia de olimpiadas
      if (url.indexOf('olimpiadas') <= 0) {
        return
      }
      // TODO save URL
      console.log(url);
    });
  });
};

exports.html = function() {
  var html = new ParseHTML('http://globoesporte.globo.com/busca/?q=olimpiadas&st=globoesporte');
  html.start(function(posts) {
    var $ = cheerio.load(posts);

    $('.resultado_da_busca').contents().each(function(i, element) {
      // title
      var title = $(this).children('.specie-content')
        .children('.busca-materia-padrao')
        .children('.busca-titulo').text();
      if (!title) return;

      // body
      var body = $(this).children('.specie-content')
        .children('.busca-materia-padrao')
        .children().last()
        .children('.busca-highlight').text();
      if (!body) return;
      body = body.trim().replace("\n", "");

      //link
      var link = $(this).children('.specie-content')
        .children('.busca-materia-padrao')
        .children().last()
        .children('.busca-link-url').attr('href');
      if (!link) return;

      // TODO tratar data

      link = linkAdapter(link);

      var news = {
        title: title,
        body: body,
        link: link
      }
      // console.log(news);
    });
  });
};

function linkAdapter(link) {
  var ahref = link.split('&u=');
  if (!ahref || ahref.length <= 0) {
    return;
  }

  ahref = ahref[1].split('&');
  if (!ahref) {
    return;
  }
  return decodeURIComponent(ahref[0]);
}
