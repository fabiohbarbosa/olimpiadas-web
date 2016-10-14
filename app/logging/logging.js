import Mongoose from '../config/mongo-connection';

let mongoose = new Mongoose();
let Schema = mongoose.Schema;

let LoggingSchema = new Schema({
  link: {
    type: String,
    index: { unique: true }
  }
}, { strict: false });

module.exports = mongoose.model('Logging', LoggingSchema);
