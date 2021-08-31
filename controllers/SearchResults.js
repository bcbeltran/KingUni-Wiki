const bcrypt = require("bcrypt");
// const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
// const { check, validationResult } = require('express-validator');

const Articles = require("../models/Articles");
const User = require("../models/User");

const SearchResults = (req, res) => {
	//console.log('this is req.query.search, ', req.query.search);
	let accessToken = req.cookies["access-token"];
	
	Articles.find(function (err, articles) {

		if (err) console.log(err);
		let noArticles = false;
		let searchTerm = req.query.search.toLowerCase();
		let articleArray = [];
		for(item of articles){
			let currTitle = item.title.toLowerCase();
			if(currTitle.includes(searchTerm)){
				articleArray.push(item);
			}
			// console.log('curr title and search term, ', currTitle, searchTerm);
		}

		
		//console.log('this is the articleArray inside of articles, ', articleArray);
		
		if (accessToken) {
			const validToken = jwt.verify(accessToken, "secret key");
			//console.log("this is the valid token id", validToken._id);
			
			if (validToken) {
				User.findById({ _id: validToken._id }, function (err, user) {
					//console.log("this is the user in the article page, ", user);
					
					if(articleArray.length === 0){
						noArticles = true;
						res.render("search-results", { noArticles, search: searchTerm, user });
						return;
					}
					res.render("search-results", {
						newArticle: articleArray,
						user,
						search: searchTerm
					});
				}).lean();
			} else {
				validToken = false;
			}

		} else {
			res.render("search-results", { newArticle: articleArray, search: searchTerm });
		}
	}).lean();
};

module.exports = SearchResults;