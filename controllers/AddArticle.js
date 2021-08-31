const bcrypt = require("bcrypt");
// const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
// const { check, validationResult } = require('express-validator');

const Articles = require("../models/Articles");
const User = require("../models/User");

const AddArticle = (req, res) => {
	let accessToken = req.cookies["access-token"];
	const validToken = jwt.verify(accessToken, "secret key");
	// console.log("this is the valid token id", validToken._id);

	User.findById({ _id: validToken._id }, function (err, user) {
		if (err) console.log(err);

		console.log("this is user", user);
		const newArticle = new Articles({
			creatorId: user._id,
			title: req.body.title,
			content: req.body.content,
			author: user.username,
			creationDate: new Date(),
		});

		if (req.body.content.length < 20) {
			let notLongEnough = true;
			res.render("create", { notLongEnough, user });
		} else {
			console.log("this is the new article, ", newArticle);
			user.createdArticles.push(newArticle);
			newArticle.save(function (err, newArticle) {
				if (err) return console.error(err);
			});

			res.redirect("/home");
		}
	}).lean();
};

module.exports = AddArticle;