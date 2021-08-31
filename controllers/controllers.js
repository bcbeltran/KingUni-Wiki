const bcrypt = require("bcrypt");
// const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
// const { check, validationResult } = require('express-validator');

const Articles = require("../models/Articles");
const User = require("../models/User");

const salt = 10;

const validateToken = (req, res, next) => {
	const accessToken = req.cookies["access-token"];

	if (!accessToken)
		return res.status(400).json({ error: "User not authenticated" });
	res.redirect("/register");
	try {
		const validToken = jwt.verify(accessToken, "secret key");
		if (validToken) {
			req.authenticated = true;
			return next();
		}
	} catch (err) {
		res.status(400).json({ error: err });
	}
};

const Index = (req, res) => {
	Articles.find(function (err, articles) {
		if (err) return err;
		let count = 0;
		let articlesArray = [];
		//console.log("these are the articles, ", articles);
		for (article of articles) {
			if (count > 2) {
	
			} else {

			let tempArticle = article;
			let newContent = article.content.substring(0, 444) + "...";
			tempArticle.content = newContent;
			//console.log("this is the article content after content manipulation, ", tempArticle);
			articlesArray.push(tempArticle);
			count++;
            }

		}
		//console.log(articlesArray);
		res.render("index", { articles: articlesArray });
	}).lean();
};

const Home = (req, res) => {
	let accessToken = req.cookies["access-token"];

	if (!accessToken) {
		res.redirect("/register");
		return;
	}
	const validToken = jwt.verify(accessToken, "secret key");
	console.log("this is the valid token id", validToken._id);

	Articles.find(function (err, articles) {
		if (err) console.log(err);

		User.findById({ _id: validToken._id }, function (err, user) {
			if (err) return err;
            let count = 0;
			let articlesArray = [];
			//console.log("these are the articles, ", articles);
			for (article of articles) {
				if (count > 2) {
	
                } else {
    
                let tempArticle = article;
                let newContent = article.content.substring(0, 444) + "...";
                tempArticle.content = newContent;
                //console.log("this is the article content after content manipulation, ", tempArticle);
                articlesArray.push(tempArticle);
                count++;
                }
    
			}

			//console.log(articlesArray);
			res.render("home", { articles: articlesArray, user });
			return;
		}).lean();
	}).lean();
};

const ArticlePage = (req, res) => {
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
					res.render("article", {
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
			res.render("article", { article, paragraph: pArray });
		}
	}).lean();
};

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

const Create = (req, res) => {
	let accessToken = req.cookies["access-token"];
	const validToken = jwt.verify(accessToken, "secret key");
	console.log("this is the valid token id", validToken._id);

	User.findById({ _id: validToken._id }, function (err, user) {
		if (err) console.log(err);

		res.render("create", { user });
	}).lean();
};

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

const LoginPage = (req, res) => {
	res.render("login");
};

const LogoutPage = (req, res) => {
	console.log("Logout successful");
	// console.log("this is the cookie, ", res.cookie['access-token']);
	res.clearCookie("access-token");
	res.redirect("/");
};

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

const RegisterPage = (req, res) => {
	res.render("register");
};

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

const DeletePage = (req, res) => {
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
					res.render("delete", {
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
			res.render("delete", { article, paragraph: pArray });
		}
	}).lean();
};

const DeletePagePOST = (req, res) => {
	let currArticle = req.params.id;
	Articles.findByIdAndDelete(currArticle, function (err, articles) {
		if (err) return err;

		console.log("Article deleted successfully");
		res.redirect("/home");
	}).lean();
};

const SearchResults = (req, res) => {
	//console.log('this is req.query.search, ', req.query.search);
	let accessToken = req.cookies["access-token"];

	Articles.find(function (err, articles) {
		if (err) console.log(err);
		let noArticles = false;
		let searchTerm = req.query.search.toLowerCase();
		let articleArray = [];
		for (item of articles) {
			let currTitle = item.title.toLowerCase();
			if (currTitle.includes(searchTerm)) {
				articleArray.push(item);
			}
			// console.log('curr title and search term, ', currTitle, searchTerm);
		}

		let newArticleArray = [];
		for (item of articleArray) {
			//console.log('this is the article inside the articleArray, ', item);
			let tempArticle = item;
			let newContent = item.content.substring(0, 333) + "...";
			tempArticle.content = newContent;
			//console.log("this is the article content after content manipulation, ", tempArticle);
			newArticleArray.push(tempArticle);
		}

		// finalArticleArray = finalArticleArray.sort(function(a, b){
		// 	if(a.title < b.title) { return -1; }
		// 	if(a.title > b.title) { return 1; }
		// 	return 0;
		// });
		let finalArticleArray = [];
		newArticleArray.map(item => {
			//console.log('this is the item.title[0] in finalArticleArray map, ', item.title[0].toLowerCase());
			if(item.title[0].toLowerCase() === searchTerm.toLowerCase()){
				finalArticleArray.unshift(item);
			} else {
				finalArticleArray.push(item);
			}
		});

		//console.log("this is the finalArticleArray, ", finalArticleArray);
		//console.log('this is the articleArray inside of articles, ', articleArray);

		if (accessToken) {
			const validToken = jwt.verify(accessToken, "secret key");
			//console.log("this is the valid token id", validToken._id);

			if (validToken) {
				User.findById({ _id: validToken._id }, function (err, user) {
					//console.log("this is the user in the article page, ", user);

					if (articleArray.length === 0) {
						noArticles = true;
						res.render("search-results", {
							noArticles,
							search: searchTerm,
							user,
						});
						return;
					}
					res.render("search-results", {
						newArticle: finalArticleArray,
						user,
						search: searchTerm,
					});
				}).lean();
			} else {
				validToken = false;
			}
		} else {

			if (articleArray.length === 0) {
				noArticles = true;
				res.render("search-results", {
					noArticles,
					search: searchTerm,
				});
				return;
			}
			res.render("search-results", {
				newArticle: finalArticleArray,
				search: searchTerm,
			});
		}
	}).lean();
};

const DisplayError = (req, res) => {
	res.render("404");
};

module.exports = {
	Index,
	ArticlePage,
	Create,
	AddArticle,
	LoginPage,
	RegisterPage,
	EditPage,
	DeletePage,
	RegisterPagePOST,
	LoginPagePOST,
	Home,
	validateToken,
	AllArticles,
	LogoutPage,
	EditPagePOST,
	DeletePagePOST,
	DisplayError,
	SearchResults,
};
