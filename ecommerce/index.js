const express = require('express');
const path = require('path');
const app = express();
const engines = require('consolidate');
const productsRouter = require('./routes/products');
app.engine('hbs', engines.handlebars);

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'hbs');
app.use('/products', productsRouter);

app.get('/', function (req, res) {
  res.render('index', { hello: 'hola', world: 'mundo' });
});

const server = app.listen(8000, function () {
  console.log(`Listening http://localhost:${server.address().port}`);
});
