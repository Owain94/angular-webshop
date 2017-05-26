import IUsersModel = require('./interfaces/IUsersModel');

class UsersModel {
  private usersModel: IUsersModel;

  constructor(usersModel: IUsersModel) {
    this.usersModel = usersModel;
  }
}

Object.seal(UsersModel);
export =  UsersModel;
