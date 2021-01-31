const express = require("express");
const server = express();
const port = 4000;
const body_parser = require('body-parser');

let data = require('./data');

server.get('/', (req, res) => {

  res.send(data);

});

server.listen(port, () => {
  console.log(`Server listening at port ${ port }`);
});
