exports.index = function (req, res) {
    var url = '';
    var parseRSS = require('../modules/parse-rss');

    var render = function(url, posts) {
        if (!url) url = '';
        if (!posts) posts = '';

        res.render('pages/parse_rss', {
            url: url,
            posts: posts
        });
    };

    // With URL
    if (req.query && req.query.url) {
        try {
            url = req.query.url;
            var parse = new parseRSS(url);

            parse.start(function (posts) {
                render(url, posts);
            });
        } catch(err) {
            render();
        }
        return;
    }

    render(url);
};
