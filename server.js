const express = require("express");
const server = express();
const port = 4000;
const body_parser = require('body-parser');

let data = require('./data');
let initialData = JSON.parse(JSON.stringify(data));

server.use(body_parser.json());

server.get('/', (req, res) => {
  res.send(data);
});

server.listen(port, () => {
  console.log(`Server listening at port ${ port }`);
});
