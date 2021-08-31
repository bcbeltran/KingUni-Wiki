const bcrypt = require("bcrypt");
// const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
// const { check, validationResult } = require('express-validator');

const Articles = require("../models/Articles");
const User = require("../models/User");

const salt = 10;

const EditPage = (req, res) => {
	let currArticle = req.params.id;
	let accessToken = req.cookies["access-token"];
	let author = false;

	Articles.findById(currArticle, function (err, article) {
		if (err) return err;

		let paragraphArray = article.content.split(`\r\n`);
		let pArray = [];
		// console.log(paragraphArray);

		paragraphArray.forEach((p) => {
			let ending = p.split("");
			let period = ending.pop();
			if (p === "") {
			} else if (period !== ".") {
				p += ".";
			} else {
				let tempObj = { p };
				pArray.push(tempObj);
			}
		});

		if (accessToken) {
			const validToken = jwt.verify(accessToken, "secret key");
			console.log("this is the valid token id", validToken._id);
			if (validToken) {
				User.findById({ _id: validToken._id }, function (err, user) {
					console.log("this is the user in the article page, ", user);

					if (user.username === article.author) {
						author = true;
					}
					// console.log(pArray);
					res.render("edit", {
						article,
						paragraph: pArray,
						author,
						user,
					});
				}).lean();
			} else {
				validToken = false;
			}
		} else {
			res.render("edit", { article, paragraph: pArray });
		}
	}).lean();
};

module.exports = EditPage;