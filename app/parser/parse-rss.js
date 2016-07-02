let url;
import ErrorException from '../exceptions/error-exception';
import FeedParser from 'feedparser';
import request from 'request';
import { Iconv } from 'iconv';
import { log } from '../utils';

module.exports = (_url) => {
  url = _url;
  if (!url) {
    throw ErrorException('Undefined URL');
  }
  return {
    start: start
  };
};

function start(callback) {
  let req = request(url);
  let feedparser = new FeedParser();

  req.on('error', done);
  req.on('response', function(res) {
    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

    let charset = getParams(res.headers['content-type'] || '').charset;
    //res = maybeTranslate(res, charset); // TODO verificar charset e conversões

    res.pipe(feedparser);
  });


  feedparser.on('error', done);

  let posts = [];
  feedparser.on('readable', function() {
    let post;
    while (post = this.read()) {
      posts.push({
        date: post.date,
        title: post.title,
        description: post.description
      });
    }
  });

  feedparser.on('end', () => {
    callback(posts);
  });

  function maybeTranslate(res, charset) {
    charset = charset ? charset : 'ISO-8859-1';
    let iconv;
    try {
      iconv = new Iconv(charset, 'UTF-8');
      iconv.on('error', done);
      res = res.pipe(iconv);
    } catch (err) {
      res.emit('error', err);
    }
    return res;
  }

  function getParams(str) {
    return str.split(';').reduce((params, param) => {
      let parts = param.split('=').map((part) => {
        return part.trim();
      });
      if (parts.length === 2) {
        params[parts[0]] = parts[1];
      }
      return params;
    }, done);
  }

  function done(err) {
    if (err) {
      log.error(err, err.stack);
    }
  }
}
