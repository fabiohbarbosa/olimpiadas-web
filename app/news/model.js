// import Mongoose from '../config/mongo-connection';
let mongoose = require('../config/mongo-connection')();

let Schema = mongoose.Schema;

let NewsSchema = new Schema({
  _id: String,
  title: String,
  body: String,
  type: String
});

module.exports = mongoose.model('News', NewsSchema);
