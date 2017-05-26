import mongoose = require('mongoose');

interface IStatsModel extends mongoose.Document {
  category: Number;
  product:  String;
  page: String;
}

export = IStatsModel;
