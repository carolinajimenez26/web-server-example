const express = require('express');
const app = express();

const hbs = require('hbs');
const helpers = require('./hbs/helpers');

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


app.get('/', (req, res) => {
  res.render('home', {'name': 'carolina'});
});

app.get('/about', (req, res) => {
  res.render('about', {'name': 'Home'});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
