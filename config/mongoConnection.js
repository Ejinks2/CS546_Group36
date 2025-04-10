import { MongoClient } from 'mongodb';

const mongoConfig = {
  serverUrl: 'mongodb://localhost:27017/',
  database: 'ucnowDB'
};

let _connection = undefined;
let _db = undefined;

export const connectToDb = async () => {
  if (!_connection) {
    _connection = new MongoClient(mongoConfig.serverUrl);
    await _connection.connect();
    _db = _connection.db(mongoConfig.database);
    console.log(`MongoDB connected to database: ${mongoConfig.database}`);
  }
  return _db;
};
