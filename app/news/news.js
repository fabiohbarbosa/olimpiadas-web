import Mongoose from '../config/mongo-connection';

let mongoose = new Mongoose();
let Schema = mongoose.Schema;

let Image = {
  _id: false,
  caption: String,
  src: String
}

let Content = {
  _id: false,
  subtitle: String,
  text: String,
  image: Image,
  order: { type: Number, required: true }
}

let NewsSchema = new Schema({
  title: String,
  body: String,
  contents: [Content],
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
  },
  credit: { type: String, required: true }
}, { strict: true } );

NewsSchema.pre('save', function(callback) {
  try {
    if (this.title) this.title = this.title.replace(/\r?\n|\r/g, "").trim();
    if (this.body) this.body = this.body.replace(/\r?\n|\r/g, "").trim();
    return callback();
  } catch (err) {
    return callback(err);
  }
});

module.exports = mongoose.model('News', NewsSchema);
