import mongoose = require('mongoose');

interface IProductModel extends mongoose.Document {
  name: string;
  price: string;
  amount: number;
  description: string;
  category: string;
  type: string;
}

export = IProductModel;
