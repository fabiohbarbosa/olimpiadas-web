var http = require("http");

var url;

module.exports = function(_url) {
    url = _url;
    var ErrorException = require('../exceptions/error-exception');

    if (!url) {
        throw ErrorException('Undefined URL');
    }

    return {
        start: start
    };
};

function start(callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}
