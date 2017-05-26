import { Request, Response } from 'express';

import IBaseController = require('./BaseController');
import StatsBusiness = require('../app/business/StatsBusiness');
import IStatsModel = require('../app/model/interfaces/IStatsModel');

class StatsController implements IBaseController<StatsBusiness> {
  create(req: Request, res: Response): void {
    try {
      const stat: IStatsModel = <IStatsModel>req.body;
      const statBusiness = new StatsBusiness();
      statBusiness.create(stat, (error, result) => {
        res.send({'error': error ? 'true' : 'false'});
      });
    } catch (e)  {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  update(req: Request, res: Response): void {
    try {
      const stat: IStatsModel = <IStatsModel>req.body;
      const _id: string = req.params._id;
      const statBusiness = new StatsBusiness();
      statBusiness.update(_id, stat, (error, result) => {
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
      const statBusiness = new StatsBusiness();
      statBusiness.delete(_id, (error, result) => {
        res.send({'error': error ? 'true' : 'false'});
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  retrieve(req: Request, res: Response): void {
    try {
      const statBusiness = new StatsBusiness();
      statBusiness.retrieve((error, result) => {
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

  retrieveRange(req: Request, res: Response): void {
    try {
      const from: string = req.query.from.replace('/', '');
      const to: string = req.query.to.replace('/', '');

      const statBusiness = new StatsBusiness();
      statBusiness.retrieveRange(Number(from), Number(to), (error, result) => {
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

  async retrieveTotal(req: Request, res: Response) {
    try {
      const statBusiness = new StatsBusiness();

      const pageCount = new Promise((resolve, reject) => {
        statBusiness.retrievePageCount((error, result) => {
          if (error) {
            reject(new Error('Something went wrong'));
          } else {
            resolve(result);
          }
        });
      });

      const productCount = new Promise((resolve, reject) => {
        statBusiness.retrieveProductCount((error, result) => {
          if (error) {
            reject(new Error('Something went wrong'));
          } else {
            resolve(result);
          }
        });
      });

      res.send({'error': 'false', 'usercount': 0, 'pageviews': await pageCount, 'productviews': await productCount});
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  findById(req: Request, res: Response): void {
    try {
      const _id: string = req.params._id;
      const statBusiness = new StatsBusiness();
      statBusiness.findById(_id, (error, result) => {
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

export = StatsController;
