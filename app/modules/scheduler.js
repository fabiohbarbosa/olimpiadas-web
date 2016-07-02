var schedule = require('node-schedule');
var globoAdapter = require('../adapters/globo-adapter');

exports.start = function() {
  globoScheduling();
};

function globoScheduling() {
  schedule.scheduleJob('*/5 * * * * *', function() {
    globoAdapter.rss();
    globoAdapter.html();
  });
}
