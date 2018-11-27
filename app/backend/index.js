const fs = require('fs'),
      path = require('path'),
      express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      flash = require('connect-flash'),
      cors = require('cors'),
      history = require('connect-history-api-fallback');

const PORT = process.env.NODE_PORT || 3000;

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
app.use(cors());

// configure view engine
app.set('view engine', 'html');

// passport
const passport = require('./libs/passport')(app);

// static files
app.use('/', express.static(path.join(__dirname, 'public')));

// routes
app.use('/api', require('./routes'));

// vue-router
app.use(history({
  logging: console.log.bind(console)
}));

app.listen(PORT, function () {
  console.log(`[app] listening on port ${PORT}`);
});

