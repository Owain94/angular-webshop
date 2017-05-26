import express = require('express');

import ProductRoutes = require('./ProductRoutes');
import CategoriesRoutes = require('./CategoriesRoutes');
import UsersRoutes = require('./UsersRoutes');
import MessagesRoutes = require('./MessagesRoutes');
import StatsRoutes = require('./StatsRoutes');

const app = express();

export class Routes {
  get routes() {
    app.use('/products', new ProductRoutes().routes);
    app.use('/categories', new CategoriesRoutes().routes);
    app.use('/users', new UsersRoutes().routes);
    app.use('/messages', new MessagesRoutes().routes);
    app.use('/stats', new StatsRoutes().routes);
    return app;
  }
}
