import mongoose = require('mongoose');

import RepositoryBase = require('./BaseRepository');

import IMessagesModel = require('../model/interfaces/IMessagesModel');
import MessagesSchema = require('../dataAccess/schemas/MessagesSchema');

class MessagesRepository extends RepositoryBase<IMessagesModel> {
  private messagesModel: mongoose.Model<mongoose.Document>;

  constructor () {
    super(MessagesSchema);
    this.messagesModel = MessagesSchema;
  }

  retrieveReceiver(receiver: string, callback: (error: any, result: IMessagesModel) => void) {
    this.messagesModel.find({'to': receiver.toLowerCase()}).sort({_id: -1}).exec(callback);
  }

  retrieveUnreadCount(receiver: string, callback: (error: any, result: number) => void) {
    this.messagesModel.count({'to': receiver.toLowerCase(), 'read': false}, callback);
  }
}

Object.seal(MessagesRepository);
export = MessagesRepository;
