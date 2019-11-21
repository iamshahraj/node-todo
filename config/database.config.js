const mongoose = require("mongoose");
const settings = require("../setting");

let config = require(`./${settings.default.environment}.config`);
mongoose.Promise = global.Promise;

module.exports.connectToMongoDb = async () => {
  let host = config.default.mongo.host;
  let port = config.default.mongo.port;
  let username = config.default.mongo.username;
  let password = config.default.mongo.password;
  let database_name = config.default.mongo.database_name;
  let connectionString = "";

  switch (settings.default.environment) {
    case "production":
      connectionString = `production url`;
      break;

    case "staging":
      connectionString = `staging url`;
      break;

    default:
      connectionString = `mongodb://${host}:${port}/${database_name}`;
      break;
  }

  try {
    let options = { useNewUrlParser: true, useUnifiedTopology: true };
    await mongoose.connect(connectionString, options);
    console.info('===== [database.config.js] connected with mongodb =====');
  } catch (error) {
    console.info('===== [database.config.js] mongodb connection failed =====');
    return error
  }
};
