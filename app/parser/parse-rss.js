import ErrorException from '../exceptions/error-exception';
import FeedParser from 'feedparser';
import request from 'request';
import { log } from '../utils';

let url;

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
    res.pipe(feedparser);
  });

  feedparser.on('error', done);

  let posts = [];
  feedparser.on('readable', function() {
    let post = this.read();
    while (post) {
      posts.push({
        pubDate: post.pubDate,
        title: post.title,
        link: post.link,
        description: post.description
      });
      post = this.read();
    }
  });

  feedparser.on('end', () => {
    callback(posts);
  });

  function done(err) {
    if (err) {
      log.error(err, err.stack);
    }
  }
}
