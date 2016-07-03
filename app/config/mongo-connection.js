import mongoose from 'mongoose';
import {
  log,
  properties,
  nodeEnv
} from '../utils';

let singleConnection = false;

module.exports = () => {
  if (singleConnection) {
    log.debug('Mongo already connect');
    return;
  }

  singleConnection = true;
  let mongoUrl = properties.mongo[nodeEnv].url;

  let con = mongoose.connect(mongoUrl, (err) => {
    if (!err) {
      log.info('Succeeded connected to: ' + mongoUrl);
      return;
    }
    singleConnection = false;
    log.error('Error connecting to: ' + mongoUrl + '. ' + err);
    process.exit();
  });

  // drop database
  if (properties.mongo[nodeEnv].drop) {
    mongoose.connection.on('open', () => {
      con.connection.db.dropDatabase(() => {
        log.info('Database dropped');
      });
    });
  }

  return mongoose;
};
