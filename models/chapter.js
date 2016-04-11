var mongoose = require('mongoose');

var chapterSchema = new mongoose.Schema({
  title: String,
  number: Number,
  text: String
});

chapterSchema.pre('save', function (next) {
  setTimeout(next, 5); // for the specs: delay just enough to make sure you handle async stuff properly
});

chapterSchema.pre('remove', function (next) {
  setTimeout(next, 5); // for the specs: delay just enough to make sure you handle async stuff properly
});

module.exports = mongoose.model('Chapter', chapterSchema);