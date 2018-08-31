require('./config/config');

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// global config of routes
app.use(require('./routes/index'));

app.use(express.static(path.join(__dirname, '../public')));


mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log(`Connected to MongoDB coffee`);
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
