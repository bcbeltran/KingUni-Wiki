const mongoose = require('mongoose');
const { Schema } = mongoose;


const articleSchema = new Schema({
	creatorId: { type: String, required: true},
	title: { type: String, required: true, unique: true, min: 5 },
	author: { type: String, required: true},
	content: { type: String, required: true, min: 20 },
	creationDate: { type: Date, default: Date.now },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;