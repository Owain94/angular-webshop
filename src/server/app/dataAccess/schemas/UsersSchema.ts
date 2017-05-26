import DataAccess = require('../DataAccess');
import IUsersModel = require('../../model/interfaces/IUsersModel');

const mongoose = DataAccess.mongooseInstance;
const mongooseConnection = DataAccess.mongooseConnection;

class UsersSchema {
  static get schema() {
    return mongoose.Schema({
      firstname: {
        type: String,
        lowercase: true,
        required: true
      },
      surname_prefix: {
        type: String,
        lowercase: true,
        required: false
      },
      surname: {
        type: String,
        lowercase: true,
        required: true
      },
      streetname: {
        type: String,
        lowercase: true,
        required: true
      },
      house_number: {
        type: String,
        required: true
      },
      postal_code: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      email: {
        type: String,
        lowercase: true,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      tfatoken: {
        type: String,
        required: false
      },
      admin: {
        type: Boolean,
        default: false,
        required: true
      },
    });
  }
}
const schema = mongooseConnection.model<IUsersModel>('Users', UsersSchema.schema);
export = schema;
