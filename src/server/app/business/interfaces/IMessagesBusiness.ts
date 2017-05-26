import BaseBusiness = require('../BaseBusiness');
import IMessagesModel  = require('../../model/interfaces/IMessagesModel');

// tslint:disable-next-line:no-empty-interface
interface IMessagesBusiness extends BaseBusiness<IMessagesModel> {

}
export = IMessagesBusiness;
