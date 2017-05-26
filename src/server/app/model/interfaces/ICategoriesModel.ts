import mongoose = require('mongoose');

interface ICategoriesModel extends mongoose.Document {
  category: string;
}

export = ICategoriesModel;
