import '../polyfills/polyfills.server';
import { enableProdMode } from '@angular/core';
import { AppServerModuleNgFactory } from './../aot/src/app/modules/app.server.module.ngfactory';
import { ngExpressEngine } from './../app/modules/ng-express-engine/express-engine';

import * as express from 'express';
import { Request, Response } from 'express';
import { ROUTES } from './../helpers/routes';
import { Routes } from '../server/config/routes/Routes';

const fs = require('fs');
const http = require('http');
const expressStaticGzip = require('express-static-gzip');
const compression = require('compression');
const bodyParser = require('body-parser');

enableProdMode();

const app = express();

app.set('port', 8000);

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory
}));

app.set('view engine', 'html');
app.set('views', 'dist');

app.get('/', (req: Request, res: Response) => {
  res.render('index', {req});
});

app.use(compression());
app.use('/', expressStaticGzip('dist', {
    indexFromEmptyFile: false,
    enableBrotli: true
  }
));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

ROUTES.forEach((route: string) => {
  app.get(route, (req: Request, res: Response) => {
    res.render('index', {
      req: req,
      res: res
    });
  });
});

app.use('/api', new Routes().routes);

app.get('*.png', (req: Request, res: Response) => {
  const img = fs.readFileSync(process.cwd() + '/dist/assets/img/no_image.jpg');
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

app.get('*', (req: Request, res: Response) => {
  res.redirect('/404');
});

const server = http.createServer(app);

server.listen(app.get('port'), function(){
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Listening at: ${host}:${port}`);
});
