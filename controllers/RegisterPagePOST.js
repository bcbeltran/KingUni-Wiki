const bcrypt = require("bcrypt");
// const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
// const { check, validationResult } = require('express-validator');

const Articles = require("../models/Articles");
const User = require("../models/User");

const salt = 10;

const RegisterPagePOST = async (req, res, err) => {
	console.log("this is req.body, ", req.body);
	const { username, password } = req.body;

	User.findOne({ username }, (err, user) => {
		if (user) {
			let nameTaken = user.username;
			console.log("this is the user, ", user);
			res.render("register", { nameTaken });
			return;
		} else if (password === req.body.repeatPassword) {
			wrongPassword = false;
			bcrypt.hash(password, salt, function (err, hash) {
				// Store hash in your password DB.
				let newUser = new User({
					username,
					password: hash,
					createdArticles: [],
				});

				newUser.save(function (err, newUser) {
					if (err) return console.error(err);
				});

				console.log("User registered");
				res.redirect("/login");
				return;
			});
		} else {
			let wrongPassword = true;
			res.render("register", { wrongPassword });
			return;
		}
	});
};

module.exports = RegisterPagePOST;