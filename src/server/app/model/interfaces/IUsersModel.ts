import mongoose = require('mongoose');

interface IUsersModel extends mongoose.Document {
  firstname: string;
  surname_prefix: string;
  surname: string;
  streetname: string;
  house_number: string;
  postal_code: string;
  city: string;
  country: string;
  email: string;
  password: string;
  tfatoken: string;
  admin: boolean;
}

export = IUsersModel;
