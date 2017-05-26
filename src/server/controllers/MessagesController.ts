import { Request, Response } from 'express';

import IBaseController = require('./BaseController');
import MessagesBusiness = require('../app/business/MessagesBusiness');
import IMessagesModel = require('../app/model/interfaces/IMessagesModel');

class MessagesController implements IBaseController<MessagesBusiness> {
  create(req: Request, res: Response): void {
    try {
      const message: IMessagesModel = <IMessagesModel>req.body;
      const messageBusiness = new MessagesBusiness();
      messageBusiness.create(message, (error, result) => {
        res.send({'error': error ? 'true' : 'false'});
      });
    } catch (e)  {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  update(req: Request, res: Response): void {
    try {
      const message: IMessagesModel = <IMessagesModel>req.body;
      const _id: string = req.params._id;
      const messageBusiness = new MessagesBusiness();
      messageBusiness.update(_id, message, (error, result) => {
        res.send({'error': error ? 'true' : 'false'});
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'error in your request'});
    }
  }

  delete(req: Request, res: Response): void {
    try {
      const _id: string = req.params._id;
      const messageBusiness = new MessagesBusiness();
      messageBusiness.delete(_id, (error, result) => {
        res.send({'error': error ? 'true' : 'false'});
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  retrieve(req: Request, res: Response): void {
    try {
      const messageBusiness = new MessagesBusiness();
      messageBusiness.retrieve((error, result) => {
        if (error) {
          res.send({'error': 'true'});
        } else {
          res.send(result);
        }
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  retrieveReceiver(req: Request, res: Response): void {
    try {
      const receiver: string = req.params.receiver;
      const messageBusiness = new MessagesBusiness();
      messageBusiness.retrieveReceiver(receiver, (error, result) => {
        if (error) {
          res.send({'error': 'true'});
        } else {
          res.send(result);
        }
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  retrieveUnreadCount(req: Request, res: Response): void {
    try {
      const receiver: string = req.params.receiver;
      const messageBusiness = new MessagesBusiness();
      messageBusiness.retrieveUnreadCount(receiver, (error, result) => {
        if (error) {
          res.send({'error': 'true'});
        } else {
          res.send({error: 'false', count: result});
        }
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  findById(req: Request, res: Response): void {
    try {
      const _id: string = req.params._id;
      const messageBusiness = new MessagesBusiness();
      messageBusiness.findById(_id, (error, result) => {
        if (error) {
          res.send({'error': 'true'});
        } else {
          res.send(result);
        }
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }
}

export = MessagesController;
