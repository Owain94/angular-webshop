import IProductModel = require('./interfaces/IProductModel');

class ProductModel {
  private productModel: IProductModel;

  constructor(productModel: IProductModel) {
    this.productModel = productModel;
  }
}

Object.seal(ProductModel);
export =  ProductModel;
