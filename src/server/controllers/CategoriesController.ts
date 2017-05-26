import { Request, Response } from 'express';

import IBaseController = require('./BaseController');
import CategoriesBusiness = require('../app/business/CategoriesBusiness');
import ICategoriesModel = require('../app/model/interfaces/ICategoriesModel');

class CategoriesController implements IBaseController<CategoriesBusiness> {
  create(req: Request, res: Response): void {
    try {
      const category: ICategoriesModel = <ICategoriesModel>req.body;
      const categoryBusiness = new CategoriesBusiness();
      categoryBusiness.create(category, (error, result) => {
        res.send({'error': error ? 'true' : 'false'});
      });
    } catch (e)  {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  update(req: Request, res: Response): void {
    try {
      const category: ICategoriesModel = <ICategoriesModel>req.body;
      const _id: string = req.params._id;
      const categoryBusiness = new CategoriesBusiness();
      categoryBusiness.update(_id, category, (error, result) => {
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
      const categoryBusiness = new CategoriesBusiness();
      categoryBusiness.delete(_id, (error, result) => {
        res.send({'error': error ? 'true' : 'false'});
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  retrieve(req: Request, res: Response): void {
    try {
      const categoryBusiness = new CategoriesBusiness();
      categoryBusiness.retrieve((error, result) => {
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

  findById(req: Request, res: Response): void {
    try {
      const _id: string = req.params._id;
      const categoryBusiness = new CategoriesBusiness();
      categoryBusiness.findById(_id, (error, result) => {
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

export = CategoriesController;
