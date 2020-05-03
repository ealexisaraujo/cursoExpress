const express = require('express');
const path = require('path');
const productsRouter = require('./routes/views/products');
const productsApiRouter = require('./routes/api/products');

const { config } = require('./config/index');

const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./utils/middlewares/errorHandlers');

const app = express();
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/products', productsRouter);
app.use('/api/products', productsApiRouter);

// redirect
app.get('/', function (req, res) {
  res.redirect('/products');
});

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

const server = app.listen(config.port, function () {
  console.log(`Listening http://localhost:${server.address().port}`);
});
