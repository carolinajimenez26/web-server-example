const express = require('express'),
      app = express();

app.use(require('./users'));
app.use(require('./login'));
app.use(require('./categories'));

module.exports = app;
