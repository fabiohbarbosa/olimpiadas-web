var schedule = require('node-schedule');
var globoAdapter = require('../adapters/globo-adapter');

exports.start = function() {
  globoScheduling();
};

function globoScheduling() {
  schedule.scheduleJob('*/2 * * * * *', function() {
    globoAdapter.rss();
    globoAdapter.html();
  });
}
