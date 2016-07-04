import express from 'express';
import load from 'express-load';

import scheduler from './scheduler';
import {
  log,
  nodeEnv
} from './utils';

log.info("Application starting to profile '" + nodeEnv + "'");

let app = express();

load('controllers')
  .then('routes')
  .into(app);

scheduler.start();

let port = process.env.PORT || 8080;
app.listen(port);

log.info('Server started on port ' + port);
