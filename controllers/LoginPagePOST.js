const bcrypt = require("bcrypt");
// const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
// const { check, validationResult } = require('express-validator');

const Articles = require("../models/Articles");
const User = require("../models/User");

const salt = 10;

const LoginPagePOST = (req, res) => {
	let currUser = req.body.username;
	console.log("this is req.body on loginPOSTpage, ", req.body);
	User.findOne({ username: currUser }, function (err, user) {
		if (!user) res.render("login", { err });

		bcrypt.compare(req.body.password, user.password).then((match) => {
			if (!match) {
				res.status(400).json({
					error: "Wrong username and password combination",
				});
				return;
			} else {
				var token = jwt.sign({ _id: user._id }, "secret key");
				res.cookie("access-token", token, {
					maxAge: 60 * 60 * 24 * 1000,
				});

				console.log("Logged in");
				//console.log(token);
			}
			res.redirect("/home");
			return;
		});
	});
};

module.exports = LoginPagePOST;