import RepositoryBase = require('./BaseRepository');

import ICategoriesModel = require('../model/interfaces/ICategoriesModel');
import CategoriesSchema = require('../dataAccess/schemas/CategoriesSchema');

class CategoriesRepository extends RepositoryBase<ICategoriesModel> {
  constructor () {
    super(CategoriesSchema);
  }
}

Object.seal(CategoriesRepository);
export = CategoriesRepository;
