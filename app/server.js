import express from 'express';
import scheduler from './scheduler';
import glob from 'glob';
import bodyParser from 'body-parser';

import { properties, log, nodeEnv } from './utils';

log.info("Application starting to profile '" + nodeEnv + "'");

let app = express();

let port = process.env.PORT || properties.server.port;
app.listen(port);

// routes and body parser
log.debug('Configuring JSON body parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

log.debug('Creating APIs');
let router = express.Router();
let routes = glob.sync(__dirname + '/apis/**/**.js', {ignore: '**/**spec.js'});

// default headers
app.use((req, res, next) => {
  res.header("Content-Type", 'application/json');
  next();
});

routes.forEach((route) => require(route)(router)); // eslint-disable-line global-require
app.use('/api', router);

log.info('Server started on port ' + port);

scheduler.start();

exports.app = app;
