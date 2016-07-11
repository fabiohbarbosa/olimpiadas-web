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
  pubDate: Date,
  createDate: {
    type: Date,
    index: { required: false },
    default: new Date()
  },
  fixed: {
    type: Boolean,
    index: { required: false }
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
