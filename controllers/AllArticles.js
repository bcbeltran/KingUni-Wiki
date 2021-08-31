const bcrypt = require("bcrypt");
// const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
// const { check, validationResult } = require('express-validator');

const Articles = require("../models/Articles");
const User = require("../models/User");

const AllArticles = (req, res) => {
	let accessToken = req.cookies["access-token"];
	console.log("this is the access token, ", accessToken);

	Articles.find(function (err, articles) {
		if (err) return err;

		if (accessToken) {
			const validToken = jwt.verify(accessToken, "secret key");
			console.log("this is the valid token id", validToken._id);

			User.findById({ _id: validToken._id }, function (err, user) {
				if (err) console.log(err);

				res.render("all-articles", { articles, user });
			}).lean();
		} else {
			res.render("all-articles", { articles });
		}
	}).lean();
};

module.exports = AllArticles;