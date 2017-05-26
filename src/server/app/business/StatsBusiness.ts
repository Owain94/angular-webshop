import StatsRepository = require('../repository/StatsRepository');
import IStatsBusiness = require('./interfaces/IStatsBusiness');
import IStatsModel = require('../model/interfaces/IStatsModel');

class StatsBusiness implements IStatsBusiness {
  private statsRepository: StatsRepository;

  constructor () {
    this.statsRepository = new StatsRepository();
  }

  create(item: IStatsModel, callback: (error: any, result: any) => void) {
    this.statsRepository.create(item, callback);
  }

  retrieve(callback: (error: any, result: any) => void) {
    this.statsRepository.retrieve(callback);
  }

  retrieveRange(from: number, to: number, callback: (error: any, result: any) => void) {
    this.statsRepository.retrieveRange(from, to, callback);
  }

  retrievePageCount(callback: (error: any, result: any) => void) {
    this.statsRepository.retrievePageCount(callback);
  }

  retrieveProductCount(callback: (error: any, result: any) => void) {
    this.statsRepository.retrieveProductCount(callback);
  }

  update(_id: string, item: IStatsModel, callback: (error: any, result: any) => void) {
    this.statsRepository.findById(_id, (err: any, res: any) => {
      if (err) {
        callback(err, res);
      } else {
        this.statsRepository.update(res._id, item, callback);
      }
    });
  }

  delete(_id: string, callback: (error: any, result: any) => void) {
    this.statsRepository.delete(_id , callback);
  }

  findById(_id: string, callback: (error: any, result: IStatsModel) => void) {
    this.statsRepository.findById(_id, callback);
  }
}

Object.seal(StatsBusiness);
export = StatsBusiness;
