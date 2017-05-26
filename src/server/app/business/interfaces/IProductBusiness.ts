import BaseBusiness = require('../BaseBusiness');
import IProductModel  = require('../../model/interfaces/IProductModel');

// tslint:disable-next-line:no-empty-interface
interface IProductBusiness extends BaseBusiness<IProductModel> {

}
export = IProductBusiness;
