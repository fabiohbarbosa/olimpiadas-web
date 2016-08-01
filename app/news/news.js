import Mongoose from '../config/mongo-connection';

let mongoose = new Mongoose();
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
  fixed: Boolean,
  pubDate: {
    type: Date,
    index: { unique: true }
  },
  createDate: {
    type: Date,
    index: { required: true },
    default: new Date()
  }
});

NewsSchema.pre('save', function(callback) {
  try {
    this.title = this.title.replace(/\r?\n|\r/g, "").trim();
    this.body = this.body.replace(/\r?\n|\r/g, "").trim();
    return callback();
  } catch (err) {
    return callback(err);
  }
});

module.exports = mongoose.model('News', NewsSchema);
