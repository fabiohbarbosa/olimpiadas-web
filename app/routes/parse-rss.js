module.exports = function(app) {
    var controller = app.controllers.parseRss;
    app.get('/parse_rss', controller.index);
};