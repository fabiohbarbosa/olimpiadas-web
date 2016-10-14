import mongoose from 'mongoose';
import {log, properties, nodeEnv, mongoUrl} from '../utils';

let singleConnection = false;

module.exports = () => {
  if (singleConnection) {
    log.debug('Mongo already connect');
    return mongoose;
  }

  singleConnection = true;

  let con = mongoose.connect(mongoUrl, (err) => {
    if (!err) {
      log.info('Succeeded connected to: ' + mongoUrl);
      return;
    }
    singleConnection = false;
    log.error('Error connecting to: ' + mongoUrl + '. ' + err);
    process.exit(1);
  });

  // drop database
  if (properties[nodeEnv].mongo.drop) {
    mongoose.connection.on('open', () => {
      con.connection.db.dropDatabase(() => {
        log.info('Database dropped');
      });
    });
  }
  return mongoose;
};
