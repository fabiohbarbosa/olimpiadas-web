import { log } from '../../utils';

function saveNews(news) {
  if (!news) return;

  news.save((err) => {
    if (err && err.code === 11000) {
      log.error(err);
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

exports.saveNews = saveNews;
