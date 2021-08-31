const bcrypt = require("bcrypt");
// const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
// const { check, validationResult } = require('express-validator');

const Articles = require("../models/Articles");
const User = require("../models/User");

const Home = (req, res) => {
	let accessToken = req.cookies["access-token"];

	if(!accessToken){
		res.redirect("/register");
		return;
	}
	const validToken = jwt.verify(accessToken, "secret key");
	console.log("this is the valid token id", validToken._id);
	
	Articles.find(function (err, articles) {
		if (err) console.log(err);

		
		User.findById({ _id: validToken._id }, function (err, user) {
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
			res.render("home", { articles: articlesArray, user });
			return;
		}).lean();
		
	}).lean();

};

module.exports = Home;