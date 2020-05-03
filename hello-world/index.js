const express = require('express');
const app = express();

app.get('/', function (req, res, next) {
  res.send('hello world');
});
c;

const server = app.listen(8000, function () {
  console.log(`Listening http://localhost:${server.adress().port}`);
});
