import http from 'http';
import ErrorException from '../exceptions/error-exception';

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
  http.get(url, (res) => {
    let data = "";
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      callback(data);
    });
  }).on("error", () => {
    callback(null);
  });
}
