// import Mongoose from '../config/mongo-connection';
let mongoose = require('../config/mongo-connection')();

let Schema = mongoose.Schema;

let NewsSchema = new Schema({
  title: String,
  body: String,
  link: {
    type: String,
    index: { unique: true }
  },
  img: String,
  type: String,
  date: {
    type: Date,
    default: new Date()
  }
});

NewsSchema.pre('save', function(callback) {
  try {
    if (this.link.slice(-1) === '/') {
      this.link = this.link.slice(0, -1);
    }
    this.title = this.title.replace(/\r?\n|\r/g, "").trim();
    this.body = this.body.replace(/\r?\n|\r/g, "").trim();
    return callback();
  } catch (err) {
    return callback(err);
  }
});

module.exports = mongoose.model('News', NewsSchema);
