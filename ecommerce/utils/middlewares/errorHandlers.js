const boom = require('@hapi/boom');
const debug = require('debug')('app:error');
const Sentry = require('@sentry/node');
const { config } = require('../../config/index');

const isRequestAjaxOrApi = require('../isRequestAjaxOrApi');

Sentry.init({
  dsn: `https://${config.sentryDns}.ingest.sentry.io/${config.sentryId}`,
});

function withErrorStack(error, stack) {
  if (config.dev) {
    return { ...error, stack };
  }

  return error;
}

function logErrors(err, req, res, next) {
  Sentry.captureException(err);
  debug(err.stack);
  next(err);
}

function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }

  next(err);
}

function clientErrorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload },
  } = err;

  // catch errors for AJAX request or if an error ocurrs while streaming
  if (isRequestAjaxOrApi(req) || res.headersSent) {
    res.status(statusCode).json(withErrorStack(payload, err.stack));
  } else {
    next(err);
  }
}

function errorHandler(err, req, res) {
  // eslint-disable-line
  const {
    output: { statusCode, payload },
  } = err;
  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
}

module.exports = {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler,
};
