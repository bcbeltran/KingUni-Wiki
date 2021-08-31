// const Index = require('../controllers');
// const ArticlePage = require('../controllers');
// const Home = require('../controllers');
// const AllArticles = require('../controllers');
// const Create = require('../controllers');
// const AddArticle = require('../controllers');
// const LoginPage = require('../controllers');
// const LoginPagePOST = require('../controllers');
// const LogoutPage = require('../controllers');
// const RegisterPage = require('../controllers');
// const RegisterPagePOST = require('../controllers');
// const EditPage = require('../controllers');
// const EditPagePOST = require('../controllers');
// const DeletePage = require('../controllers');
// const DeletePagePOST = require('../controllers');
// const SearchResults = require('../controllers');
// const DisplayError = require('../controllers');

const {
	Index,
	ArticlePage,
	LogoutPage,
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
	EditPagePOST,
	DeletePagePOST,
	DisplayError,
	SearchResults,
} = require("../controllers/controllers");

module.exports = (app) => {
	app.get("/", Index);

	app.get("/logout", LogoutPage);

	app.get("/home", Home);

	app.get("/search", SearchResults);

	app.get("/article/:id", ArticlePage);

	app.get("/articles/all", AllArticles);

	app.get("/create", Create);

	app.post("/create", AddArticle);

	app.get("/login", LoginPage);

	app.post("/login", LoginPagePOST);

	app.get("/register", RegisterPage);

	app.post("/register", RegisterPagePOST);

	app.get("/edit/:id", EditPage);

	app.post("/edit/:id", EditPagePOST);

	app.get("/delete/:id", DeletePage);

	app.post("/delete/:id", DeletePagePOST);

	app.get("/*", DisplayError);
};
