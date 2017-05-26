import mongoose = require('mongoose');

import RepositoryBase = require('./BaseRepository');

import IStatsModel = require('../model/interfaces/IStatsModel');
import StatsSchema = require('../dataAccess/schemas/StatsSchema');

class StatsRepository extends RepositoryBase<IStatsModel> {
  private statsModel: mongoose.Model<mongoose.Document>;

  constructor () {
    super(StatsSchema);
    this.statsModel = StatsSchema;
  }

  retrieveRange(from: number, to: number, callback: (error: any, result: any) => void) {
    this.statsModel.find({date: { $gt: from, $lt: to}}, callback);
  }

  retrievePageCount(callback: (error: any, result: any) => void) {
    this.statsModel.count({page: {$exists: true}}, callback);
  }

  retrieveProductCount(callback: (error: any, result: any) => void) {
    this.statsModel.count({product: {$exists: true}}, callback);
  }
}

Object.seal(StatsRepository);
export = StatsRepository;
