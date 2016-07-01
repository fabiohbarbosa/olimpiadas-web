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
    var FeedParser = require('feedparser');
    var request = require('request');
    var Iconv = require('iconv').Iconv;

    var req = request(url);
    var feedparser = new FeedParser();

    req.on('error', done);

    req.on('response', function (res) {
        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

        var charset = getParams(res.headers['content-type'] || '').charset;
        //res = maybeTranslate(res, charset); // TODO verificar charset e conversões

        res.pipe(feedparser);
    });


    feedparser.on('error', done);

    var posts = [];
    feedparser.on('readable', function () {
        var post;
        while (post = this.read()) {
            posts.push({ date: post.date, title: post.title, description: post.description });
        }
    });

    feedparser.on('end', function() {
        callback(posts);
    });

    function maybeTranslate(res, charset) {
        charset = charset ? charset : 'ISO-8859-1';
        var iconv;
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
        return str.split(';').reduce(function (params, param) {
            var parts = param.split('=').map(function (part) {
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
            console.error(err, err.stack);
        }
    }
}
