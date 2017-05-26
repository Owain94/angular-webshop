import BaseBusiness = require('../BaseBusiness');
import IUsersModel  = require('../../model/interfaces/IUsersModel');

// tslint:disable-next-line:no-empty-interface
interface IUsersBusiness extends BaseBusiness<IUsersModel> {

}
export = IUsersBusiness;
