import express = require('express');
import StatsController = require('../../controllers/StatsController');

const router = express.Router();

class StatsRoutes {
  private statsController: StatsController;

  constructor () {
    this.statsController = new StatsController();
  }

  get routes () {
    const controller = this.statsController;

    router.get('/', controller.retrieve);
    router.get('/total', controller.retrieveTotal);
    router.get('/range', controller.retrieveRange);
    router.post('/', controller.create);
    router.put('/:_id', controller.update);
    router.delete('/:_id', controller.delete);

    return router;
  }
}

Object.seal(StatsRoutes);
export = StatsRoutes;
