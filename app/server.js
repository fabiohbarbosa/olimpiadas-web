import express from 'express';
import scheduler from './scheduler';
import {
  log,
  nodeEnv
} from './utils';

log.info("Application starting to profile '" + nodeEnv + "'");

let app = express();

let port = process.env.PORT || 8080;
app.listen(port);

log.info('Server started on port ' + port);

scheduler.start();
