import ProductRepository = require('../repository/ProductRepository');
import IProductBusiness = require('./interfaces/IProductBusiness');
import IProductModel = require('../model/interfaces/IProductModel');


class ProductBusiness implements IProductBusiness {
  private productRepository: ProductRepository;

  constructor () {
    this.productRepository = new ProductRepository();
  }

  create(item: IProductModel, callback: (error: any, result: any) => void) {
    this.productRepository.create(item, callback);
  }

  retrieve(callback: (error: any, result: any) => void) {
    this.productRepository.retrieve(callback);
  }

  retrieveLimit(amount: number, callback: (error: any, result: any) => void) {
    this.productRepository.retrieveLimit(amount, callback);
  }

  update(_id: string, item: IProductModel, callback: (error: any, result: any) => void) {
    this.productRepository.findById(_id, (err: any, res: any) => {
      if (err) {
        callback(err, res);
      } else {
        this.productRepository.update(res._id, item, callback);
      }
    });
  }

  delete(_id: string, callback: (error: any, result: any) => void) {
    this.productRepository.delete(_id , callback);
  }

  findById(_id: string, callback: (error: any, result: IProductModel) => void) {
    this.productRepository.findById(_id, callback);
  }
}

Object.seal(ProductBusiness);
export = ProductBusiness;
