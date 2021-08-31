const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    
    app.set("view engine", "hbs");
    app.engine(
	    "hbs",
	    exphbs({
            extname: "hbs",
            defaultLayout: "",
            layoutsDir: __dirname + "/views",
            partialsDir: __dirname + "/views",
        })
    );

    app.use(express.json());

    //Setup the body parser
    app.use(bodyParser.urlencoded({extended: true}));

    //Setup the static files
    app.use(express.static('static'));

    //Setup cookie-parser
    app.use(cookieParser());

};