import IMessagesModel = require('./interfaces/IMessagesModel');

class MessagesModel {
  private messagesModel: IMessagesModel;

  constructor(messagesModel: IMessagesModel) {
    this.messagesModel = messagesModel;
  }
}

Object.seal(MessagesModel);
export =  MessagesModel;
