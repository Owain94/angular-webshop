import express = require('express');
import MessagesController = require('../../controllers/MessagesController');

const router = express.Router();

class MessagesRoutes {
  private messagesController: MessagesController;

  constructor () {
    this.messagesController = new MessagesController();
  }

  get routes () {
    const controller = this.messagesController;

    router.get('/:receiver', controller.retrieveReceiver);
    router.get('/:receiver/unreadcount', controller.retrieveUnreadCount);
    router.post('/', controller.create);
    router.put('/:_id/read', controller.update);

    return router;
  }
}

Object.seal(MessagesRoutes);
export = MessagesRoutes;
