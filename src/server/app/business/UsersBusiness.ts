import UsersRepository = require('../repository/UsersRepository');
import IUsersBusiness = require('./interfaces/IUsersBusiness');
import IUsersModel = require('../model/interfaces/IUsersModel');

class UsersBusiness implements IUsersBusiness {
  private usersRepository: UsersRepository;

  constructor () {
    this.usersRepository = new UsersRepository();
  }

  create(item: IUsersModel, callback: (error: any, result: any) => void) {
    this.usersRepository.create(item, callback);
  }

  retrieve(callback: (error: any, result: any) => void) {
    this.usersRepository.retrieve(callback);
  }

  update(_id: string, item: IUsersModel, callback: (error: any, result: any) => void) {
    this.usersRepository.findById(_id, (err: any, res: any) => {
      if (err) {
        callback(err, res);
      } else {
        this.usersRepository.update(res._id, item, callback);
      }
    });
  }

  updateByEmail(email: string, item: IUsersModel, callback: (error: any, result: any) => void) {
    this.usersRepository.findByEmail(email, (err: any, res: any) => {
      if (err) {
        callback(err, res);
      } else {
        this.usersRepository.update(res._id, item, callback);
      }
    });
  }

  delete(_id: string, callback: (error: any, result: any) => void) {
    this.usersRepository.delete(_id , callback);
  }

  findById(_id: string, callback: (error: any, result: IUsersModel) => void) {
    this.usersRepository.findById(_id, callback);
  }

  findByEmail(email: string, callback: (error: any, result: IUsersModel) => void) {
    this.usersRepository.findByEmail(email, callback);
  }
}

Object.seal(UsersBusiness);
export = UsersBusiness;
