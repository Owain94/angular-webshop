import CategoriesRepository = require('../repository/CategoriesRepository');
import ICategoriesBusiness = require('./interfaces/ICategoriesBusiness');
import ICategoriesModel = require('../model/interfaces/ICategoriesModel');

class CategoriesBusiness implements ICategoriesBusiness {
  private categoriesRepository: CategoriesRepository;

  constructor () {
    this.categoriesRepository = new CategoriesRepository();
  }

  create(item: ICategoriesModel, callback: (error: any, result: any) => void) {
    this.categoriesRepository.create(item, callback);
  }

  retrieve(callback: (error: any, result: any) => void) {
    this.categoriesRepository.retrieve(callback);
  }

  update(_id: string, item: ICategoriesModel, callback: (error: any, result: any) => void) {
    this.categoriesRepository.findById(_id, (err: any, res: any) => {
      if (err) {
        callback(err, res);
      } else {
        this.categoriesRepository.update(res._id, item, callback);
      }
    });
  }

  delete(_id: string, callback: (error: any, result: any) => void) {
    this.categoriesRepository.delete(_id , callback);
  }

  findById(_id: string, callback: (error: any, result: ICategoriesModel) => void) {
    this.categoriesRepository.findById(_id, callback);
  }
}

Object.seal(CategoriesBusiness);
export = CategoriesBusiness;
