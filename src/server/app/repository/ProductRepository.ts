import mongoose = require('mongoose');

import RepositoryBase = require('./BaseRepository');

import IProductModel = require('../model/interfaces/IProductModel');
import ProductSchema = require('../dataAccess/schemas/ProductSchema');

class ProductRepository extends RepositoryBase<IProductModel> {
  private productsModel: mongoose.Model<mongoose.Document>;

  constructor () {
    super(ProductSchema);
    this.productsModel = ProductSchema;
  }

  retrieveLimit(amount: number, callback: (error: any, result: any) => void) {
    this.productsModel.find({}).sort({_id: -1}).limit(amount).exec(callback);
  }
}

Object.seal(ProductRepository);
export = ProductRepository;
