const bcrypt = require("bcrypt");
// const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
// const { check, validationResult } = require('express-validator');

const Articles = require("../models/Articles");
const User = require("../models/User");

const EditPagePOST = (req, res) => {
	let currArticle = req.params.id;
	Articles.findByIdAndUpdate(
		{ _id: currArticle },
		{
			content: req.body.content,
			creationDate: new Date(),
		},
		function (err, article) {
			if (err) return err;
			console.log("updated successfully");
			res.redirect("/home");
		}
	).lean();
};

module.exports = EditPagePOST;