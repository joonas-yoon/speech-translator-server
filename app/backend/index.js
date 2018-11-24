const fs = require('fs'),
      express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      flash = require("connect-flash");

const PORT = 3000;

// database
const mongoose = require('./libs/mongoose');

// application
const app = express();
app.use(session({
  secret: process.env.NODE_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

// passport
const passport = require('./libs/passport')(app);

// vue-router
app.use(require('connect-history-api-fallback')());

// routes
app.use('/', require('./routes'));

app.listen(PORT, function () {
  console.log(`[app] listening on port ${PORT}`);
});

