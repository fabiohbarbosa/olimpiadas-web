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

app.listen(8080);
log.info('Server started on port 8080');
