import mongoose = require('mongoose');

import RepositoryBase = require('./BaseRepository');

import IUsersModel = require('../model/interfaces/IUsersModel');
import UsersSchema = require('../dataAccess/schemas/UsersSchema');

class UsersRepository extends RepositoryBase<IUsersModel> {
  private usersModel: mongoose.Model<mongoose.Document>;

  constructor () {
    super(UsersSchema);
    this.usersModel = UsersSchema;
  }

  findByEmail(email: string, callback: (error: any, result: IUsersModel) => void) {
    this.usersModel.findOne({'email': email.toLowerCase()}, callback);
  }
}

Object.seal(UsersRepository);
export = UsersRepository;
