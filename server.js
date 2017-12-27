"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const cookieParser  = require('cookie-parser');
const cookieSession = require('cookie-session');

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const datahelper = require('./routes/datahelpers.js')(knex);

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('tiny'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));
//
app.use(cookieParser());
app.use(cookieSession({
  name: 'user_info',
  keys: [process.env.SESSION_SECRET_KEY || "some secret key"]
}));
//
//locals
app.use(function (req, res, next) {
  const session = req.session.user_id;
  const email = req.session.email
  res.locals.user_id = session;
  res.locals.user_email = email;
  next();
});



//
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/users", usersRoutes(datahelper));

//app.use("/users", usersRoutes(knex));
// Home page
app.get("/", (req, res) => {
  if(req.session.user_id){
    return res.render('index');
  }else{
    res.redirect('login');
  }
});

app.get('/new', (req, res) => {
  return res.render('register');
})


app.get('/login', (req, res) => {

  return res.render('login');
});


// add login route later


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
