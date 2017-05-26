import DataAccess = require('../DataAccess');
import ICategoriesModel = require('../../model/interfaces/ICategoriesModel');

const mongoose = DataAccess.mongooseInstance;
const mongooseConnection = DataAccess.mongooseConnection;

class CategoriesSchema {
  static get schema() {
    return mongoose.Schema({
      category: {
        type: String,
        required: true
      }
    });
  }
}
const schema = mongooseConnection.model<ICategoriesModel>('Categories', CategoriesSchema.schema);
export = schema;
