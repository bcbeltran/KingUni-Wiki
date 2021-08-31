const bcrypt = require("bcrypt");
// const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
// const { check, validationResult } = require('express-validator');

const Articles = require("../models/Articles");
const User = require("../models/User");

const Index = (req, res) => {
	Articles.find(function (err, articles) {
		if (err) return err;
		let articlesArray = [];
		//console.log("these are the articles, ", articles);
		for (article of articles) {
			let tempArticle = article;
			let newContent = article.content.substring(0, 444) + "...";
			tempArticle.content = newContent;
			//console.log("this is the article content after content manipulation, ", tempArticle);
			articlesArray.push(tempArticle);
		}
		//console.log(articlesArray);
		res.render("index", { articles: articlesArray });
	}).lean();
};


module.exports = Index;