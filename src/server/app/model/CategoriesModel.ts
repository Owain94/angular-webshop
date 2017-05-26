import ICategoriesModel = require('./interfaces/ICategoriesModel');

class CategoriesModel {
  private categoriesModel: ICategoriesModel;

  constructor(categoriesModel: ICategoriesModel) {
    this.categoriesModel = categoriesModel;
  }
}

Object.seal(CategoriesModel);
export =  CategoriesModel;
