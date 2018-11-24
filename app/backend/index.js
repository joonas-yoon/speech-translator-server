const fs = require('fs'),
      express = require('express'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override');

const PORT = 3000;

// database
const mongoose = require('./libs/mongoose');

// application
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

// vue-router
app.use(require('connect-history-api-fallback')());

// routes
const passport = require('./libs/passport')(app);
app.use('/', require('./routes'));

app.listen(PORT, function () {
  console.log(`[app] listening on port ${PORT}`);
});

