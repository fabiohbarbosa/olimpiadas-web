import mongoose from 'mongoose';
import {
  log,
  properties,
  nodeEnv
} from '../utils';

let single_connection_mongo = false;

module.exports = () => {
  if (single_connection_mongo) {
    log.debug('Mongo already connect');
    return;
  }

  single_connection_mongo = true;
  let mongoUrl = properties.mongo[nodeEnv];

  mongoose.connect(mongoUrl, (err) => {
    if (!err) {
      log.info('Succeeded connected to: ' + mongoUrl);
      return;
    }
    single_connection_mongo = false;
    log.error('Error connecting to: ' + mongoUrl + '. ' + err);
    process.exit();
  });

  return mongoose;
};
