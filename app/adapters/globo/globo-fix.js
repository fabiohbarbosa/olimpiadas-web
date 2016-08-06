import { News } from '../../news';
import { log } from '../../utils';
import { adapterContents, saveNews } from './globo-adapter-commons';


let query = {
  contents: { $exists: false }
};

News.find(query).limit(50).exec((err, news) => {
  if (err) {
    log.error(err);
    return;
  }

  if (!news || news.length === 0) {
    log.info('Not found news');
    return;
  }
  log.info('Found ' + news.length + ' news');
});

/*
let urlTmp = "http://globoesporte.globo.com/am/noticia/2016/06/inscricoes-para-voluntariado-na-olimpiada-no-am-sao-prorrogadas.html";
let contentPromise = adapterContents(urlTmp);
contentPromise.then((data) => {
  log.debug(JSON.stringify(data, null, 2));
  let news = new News();
  news.contents = data;
  saveNews(news);
});
*/
