import MessagesRepository = require('../repository/MessagesRepository');
import IMessagesBusiness = require('./interfaces/IMessagesBusiness');
import IMessagesModel = require('../model/interfaces/IMessagesModel');

class MessagesBusiness implements IMessagesBusiness {
  private messagesRepository: MessagesRepository;

  constructor () {
    this.messagesRepository = new MessagesRepository();
  }

  create(item: IMessagesModel, callback: (error: any, result: any) => void) {
    this.messagesRepository.create(item, callback);
  }

  retrieve(callback: (error: any, result: any) => void) {
    this.messagesRepository.retrieve(callback);
  }

  retrieveReceiver(receiver: string, callback: (error: any, result: any) => void) {
    this.messagesRepository.retrieveReceiver(receiver, callback);
  }

  retrieveUnreadCount(receiver: string, callback: (error: any, result: number) => void) {
    this.messagesRepository.retrieveUnreadCount(receiver, callback);
  }

  update(_id: string, item: IMessagesModel, callback: (error: any, result: any) => void) {
    this.messagesRepository.findById(_id, (err: any, res: any) => {
      if (err) {
        callback(err, res);
      } else {
        this.messagesRepository.update(res._id, item, callback);
      }
    });
  }

  delete(_id: string, callback: (error: any, result: any) => void) {
    this.messagesRepository.delete(_id , callback);
  }

  findById(_id: string, callback: (error: any, result: IMessagesModel) => void) {
    this.messagesRepository.findById(_id, callback);
  }
}

Object.seal(MessagesBusiness);
export = MessagesBusiness;
