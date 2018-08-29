const express = require('express'),
      app = express();

app.use(require('./users'));
app.use(require('./login'));

module.exports = app;
