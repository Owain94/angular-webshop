import IStatsModel = require('./interfaces/IStatsModel');

class StatsModel {
  private statsModel: IStatsModel;

  constructor(statsModel: IStatsModel) {
    this.statsModel = statsModel;
  }
}

Object.seal(StatsModel);
export =  StatsModel;
