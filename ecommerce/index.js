const express = require('express');
const path = require('path');
const boom = require('@hapi/boom');
const productsRouter = require('./routes/views/products');
const productsApiRouter = require('./routes/api/products');
const authApiRouter = require('./routes/api/auth');

const { config } = require('./config/index');

const {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler,
} = require('./utils/middlewares/errorHandlers');
const isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi');

// app
const app = express();
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// routes
app.use('/products', productsRouter);
productsApiRouter(app);
app.use('/api/auth', authApiRouter);

// redirect
app.get('/', function (req, res) {
  res.redirect('/products');
});

app.use(function (req, res) {
  if (isRequestAjaxOrApi(req)) {
    const {
      output: { statusCode, payload },
    } = boom.notFound();

    res.status(statusCode).json(payload);
  }

  res.status(404).render('404');
});

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

const server = app.listen(config.port, function () {
  console.log(`Listening http://localhost:${server.address().port}`);
});
