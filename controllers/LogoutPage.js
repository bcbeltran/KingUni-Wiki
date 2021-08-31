const LogoutPage = (req, res) => {
	console.log("Logout successful");
	// console.log("this is the cookie, ", res.cookie['access-token']);
	res.clearCookie("access-token");
	res.redirect("/");
};

module.exports = LogoutPage;