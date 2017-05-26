import DataAccess = require('../DataAccess');
import IMessagesModel = require('../../model/interfaces/IMessagesModel');

const mongoose = DataAccess.mongooseInstance;
const mongooseConnection = DataAccess.mongooseConnection;

class MessagesSchema {
  static get schema() {
    return mongoose.Schema({
      to: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: new Date(),
        required: true
      },
      firstname: {
        type: String,
        required: true
      },
      surname_prefix: {
        type: String,
        required: false
      },
      surname: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      subject: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      read: {
        type: Boolean,
        default: false,
        required: true
      }
    });
  }
}
const schema = mongooseConnection.model<IMessagesModel>('Messages', MessagesSchema.schema);
export = schema;
