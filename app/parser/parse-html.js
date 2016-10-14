import http from 'http';
import cheerio from 'cheerio';
import HttpStatus from 'http-status-codes';

import { log } from '../utils';

module.exports = () => {
  return {
    start: start
  };
};

function start(url, callback) {
  http.get(url, (res) => {
    if (res.statusCode === HttpStatus.MOVED_PERMANENTLY) {
      let redirectUrl = res.headers.location;
      log.debug('Redirect to ' + redirectUrl + ' from ' + url);
      start(redirectUrl, callback)
      return;
    }

    let data = "";
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log('########################################')
      console.log(data)
      console.log('########################################')
      let htmlData = cheerio.load(data);
      callback(htmlData);
    });
  }).on("error", () => {
    callback(null);
  });
}
