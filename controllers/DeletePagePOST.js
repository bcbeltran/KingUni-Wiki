const bcrypt = require("bcrypt");
// const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
// const { check, validationResult } = require('express-validator');

const Articles = require("../models/Articles");
const User = require("../models/User");

const DeletePagePOST = (req, res) => {
	let currArticle = req.params.id;
	Articles.findByIdAndDelete(currArticle, function (err, articles) {
		if (err) return err;
		
		console.log("Article deleted successfully");
		res.redirect("/home");
	}).lean();
};

module.exports = DeletePagePOST;