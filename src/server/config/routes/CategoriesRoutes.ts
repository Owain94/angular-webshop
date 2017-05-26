import express = require('express');
import CategoriesController = require('../../controllers/CategoriesController');

const router = express.Router();

class CategoriesRoutes {
  private categoriesController: CategoriesController;

  constructor () {
    this.categoriesController = new CategoriesController();
  }

  get routes () {
    const controller = this.categoriesController;

    router.get('/', controller.retrieve);
    router.post('/', controller.create);
    router.put('/:_id', controller.update);
    router.delete('/:_id', controller.delete);

    return router;
  }
}

Object.seal(CategoriesRoutes);
export = CategoriesRoutes;
