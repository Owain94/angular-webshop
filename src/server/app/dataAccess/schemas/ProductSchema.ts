import DataAccess = require('../DataAccess');
import IProductModel = require('../../model/interfaces/IProductModel');

const mongoose = DataAccess.mongooseInstance;
const mongooseConnection = DataAccess.mongooseConnection;

class ProductSchema {
  static get schema() {
    return mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      price: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    });
  }
}
const schema = mongooseConnection.model<IProductModel>('Products', ProductSchema.schema);
export = schema;
