// import Mongoose from '../config/mongo-connection';
let mongoose = require('../config/mongo-connection')();

let Schema = mongoose.Schema;

let NewsSchema = new Schema({
  _id: String,
  title: String,
  body: String,
  img: String,
  type: String,
  date: {
    type: Date,
    default: new Date()
  }
});


NewsSchema.pre('save', function(callback) {
  try {
    this._id = removeLastChar(this._id);
    this.title = replaceRegexChars(this.title);
    this.body = replaceRegexChars(this.body);
    return callback();
  } catch (err) {
    return callback(err);
  }

  function removeLastChar(str) {
    if (str.slice(-1) === '/') {
      return str.slice(0, -1);
    }
  }

  function replaceRegexChars(str) {
    return str.replace(/\r?\n|\r/g, "");
  }
});

module.exports = mongoose.model('News', NewsSchema);
