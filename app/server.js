import express from 'express';
import load from 'express-load';
import scheduler from './modules/scheduler';
import {log} from './utils';

let app = express();

load('controllers')
    .then('routes')
    .into(app);

scheduler.start();

app.listen(8080);
log.info('Server started on port 8080');
