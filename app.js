const express = require("express");

// App settings
const settings = require('./setting');

// cors import
const cors = require("cors");

// to set data type
const bodyParser = require("body-parser");

// for mongodb
const mongo = require('./config/database.config');

// for data changes
const _ = require('lodash');

// For url logs
const morgan = require('morgan')

// Routes 
const todosRoutes = require('./routes/todos')

// Creating app varialble
const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev')) // logger

// Routes 
app.use('/todos', todosRoutes);

// mongoose db connection
mongo.connectToMongoDb()

// global error control
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status).send(message);
});

// Getting port from settings
const port = settings.default.port;
app.listen(port);
