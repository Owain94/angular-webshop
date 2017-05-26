import { Request, Response } from 'express';

import IBaseController = require('./BaseController');
import ProductBusiness = require('../app/business/ProductBusiness');
import IProductModel = require('../app/model/interfaces/IProductModel');

const base64Img = require('base64-img');
const imageBasePath = 'dist/assets/products/';

class ProductController implements IBaseController<ProductBusiness> {
  create(req: Request, res: Response): void {
    try {
      const product: IProductModel = <IProductModel>req.body;

      product.price = String(product.price).replace(',', '.');
      product.type = product['photo'].split(';base64')[0].replace('data:image/', '');

      if (product.type === 'jpeg') {
        product.type = 'jpg';
      }

      const productBusiness = new ProductBusiness();
      productBusiness.create(product, (error, result) => {
        if (!error) {
          base64Img.img(req.body.photo, imageBasePath, result._id, (err: any, filepath: string) => {
            res.send({'error': err ? 'true' : 'false'});
          });
        } else {
          res.send({'error': 'true'});
        }
      });
    } catch (e)  {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  update(req: Request, res: Response): void {
    try {
      const product: IProductModel = <IProductModel>req.body;
      const _id: string = req.params._id;

      product.price = String(product.price).replace(',', '.');
      product.type = product['photo'].split(';base64')[0].replace('data:image/', '');

      if (product.type === 'jpeg') {
        product.type = 'jpg';
      }

      const productBusiness = new ProductBusiness();
      productBusiness.update(_id, product, (error, result) => {
        if (!error) {
          base64Img.img(req.body.photo, imageBasePath, result._id, (err: any, filepath: string) => {
            res.send({'error': err ? 'true' : 'false'});
          });
        } else {
          res.send({'error': 'true'});
        }
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  delete(req: Request, res: Response): void {
    try {
      const _id: string = req.params._id;
      const productBusiness = new ProductBusiness();
      productBusiness.delete(_id, (error, result) => {
        res.send({'error': error ? 'true' : 'false'});
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  retrieve(req: Request, res: Response): void {
    try {
      const productBusiness = new ProductBusiness();
      productBusiness.retrieve((error, result) => {
        if (error) {
          res.send({'error': 'true'});
        } else {
          res.send(result);
        }
      });
    } catch (e) {
      console.log(e.message);
      res.send({'error': 'true'});
    }
  }

  retrieveLimit(req: Request, res: Response): void {
    try {
      // tslint:disable-next-line:radix
      const amount: number = parseInt(req.params.amount);
      const productBusiness = new ProductBusiness();
      productBusiness.retrieveLimit(amount, (error, result) => {
        if (error) {
          res.send({'error': 'true'});
        } else {
          res.send(result);
        }
      });
    } catch (e) {
      console.log(e.message);
      res.send({'error': 'true'});
    }
  }

  findById(req: Request, res: Response): void {
    try {
      const _id: string = req.params._id;
      const productBusiness = new ProductBusiness();
      productBusiness.findById(_id, (error, result) => {
        if (error) {
          res.send({'error': 'true'});
        } else {
          if (!result) {
            res.send({'error': 'true', 'name': 'Verwijderd'});
          } else {
            res.send(result);
          }
        }
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }
}

export = ProductController;
