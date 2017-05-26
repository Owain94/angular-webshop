import mongoose = require('mongoose');

interface IMessagesModel extends mongoose.Document {
  to: string;
  date: Date;
  firstname: string;
  surname_prefix: string;
  surname: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
}

export = IMessagesModel;
