var single_connection_mongo = false;

module.exports = function () {
    var config = require('../../environment/config');
    var mongoose = require('mongoose');
    var env_url = config.db.mongo.env_url;
    var logger = require('../logger')(__filename);
    var environment = require('../../environment');

    if (!environment.isEnvironmentUnitTest()) {
        if (!single_connection_mongo) {
            single_connection_mongo = true;
            var mongoUrl = env_url[environment.getNodeEnv()];
            mongoose.connect(mongoUrl, function (err) {
                if (err) {
                    single_connection_mongo = false;
                    console.error('ERROR connecting to: ' + mongoUrl + '. ' + err);
                    process.exit();
                } else {
                    console.log('Succeeded connected to: ' + mongoUrl);
                }
            });
        }
    }
    return mongoose;
};
