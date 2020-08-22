const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const cors = require('cors');

const PORT = process.env.NODE_PORT || 3000;

// database
const mongoose = require('./libs/mongoose');

// application
const app = express();
app.use(
  session({
    secret: process.env.NODE_SECRET || 'keyboardcat',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

// configure view engine
app.set('view engine', 'html');

// passport
const passport = require('./libs/passport')(app);

// routes
app.use('/api', require('./routes'));

// static files
app.use('/static', express.static(path.join(__dirname, 'public/static')));

// all others are reached the files under public
app.use('*', express.static(path.join(__dirname, 'public')));

app.listen(PORT, function () {
  console.log(`[app] listening on port ${PORT}`);
});
