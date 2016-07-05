import express from 'express';
import load from 'express-load';
import bodyParser from 'body-parser';

import scheduler from './scheduler';
import {
  log,
  nodeEnv
} from './utils';

log.info("Application starting to profile '" + nodeEnv + "'");

let app = express();

// json body
log.debug('Configuring JSON body parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// load apis
load('app/apis').into(app);

let port = process.env.PORT || 8080;
app.listen(port);

log.info('Server started on port ' + port);

scheduler.start();
