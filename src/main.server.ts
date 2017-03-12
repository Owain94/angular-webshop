import 'zone.js/dist/zone-node';
import { platformServer, renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
import { AppServerModule } from './app/app.server.module';
import { AppServerModuleNgFactory } from './aot/src/app/app.server.module.ngfactory';
import * as express from 'express';
import {ngExpressEngine} from './express-engine';

const port = 8000;
const baseUrl = `http://localhost:${port}`;

enableProdMode();

const app = express();

app.engine('html', ngExpressEngine({
  baseUrl: baseUrl,
  bootstrap: [
    AppServerModuleNgFactory
  ]
}));

app.set('view engine', 'html');
app.set('views', '.');

app.get('/', (req, res) => {
  res.render('index', {req});
});

app.get('/home*', (req, res) => {
  res.render('index', {req});
});

app.use(express.static('.'));

app.listen(port, () => {
  console.log('listening...');
});
