import DataAccess = require('../DataAccess');
import IStatsModel = require('../../model/interfaces/IStatsModel');

const mongoose = DataAccess.mongooseInstance;
const mongooseConnection = DataAccess.mongooseConnection;

class StatsSchema {
  static get schema() {
    return mongoose.Schema({
      date: {
        type: Number,
        default: new Date().setHours(0, 0, 0, 0),
        required: true
      },
      product: {
        type: String,
        required: false
      },
      page: {
        type: String,
        required: false
      }
    });
  }
}
const schema = mongooseConnection.model<IStatsModel>('Stats', StatsSchema.schema);
export = schema;
