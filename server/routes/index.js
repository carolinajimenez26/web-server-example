const express = require('express'),
      app = express();

app.use(require('./users'));
app.use(require('./login'));
app.use(require('./categories'));
app.use(require('./products'));
app.use(require('./uploads'));

module.exports = app;
