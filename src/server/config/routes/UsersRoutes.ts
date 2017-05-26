import express = require('express');
import UsersController = require('../../controllers/UsersController');

const router = express.Router();

class UsersRoutes {
  private usersController: UsersController;

  constructor () {
    this.usersController = new UsersController();
  }

  get routes () {
    const controller = this.usersController;

    router.get('/', controller.retrieve);
    router.get('/tfa', controller.generateToken);

    router.post('/', controller.create);
    router.post('/login', controller.login);
    router.post('/check_tfa', controller.checkTfa);
    router.post('/profile', controller.findByEmail);
    router.post('/verify', controller.verify);
    router.post('/tfa', controller.verifyTokenAndSave);

    router.put('/', controller.update);
    router.put('/password', controller.updatePassword);
    router.put('/tfa', controller.update);

    router.delete('/:_id', controller.delete);

    return router;
  }
}

Object.seal(UsersRoutes);
export = UsersRoutes;
