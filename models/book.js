var Schema = require('mongoose').Schema;

module.exports = new Schema({
	title: String,
	author: {type: Schema.Types.ObjectId, ref: 'Author'},
	chapters: [{type: Schema.Types.ObjectId, ref: 'Chapter'}]
});