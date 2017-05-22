import '../polyfills/polyfills.server';
import { AppServerModule } from './../app/modules/app.server.module';
import { ngExpressEngine } from './../app/modules/ng-express-engine/express-engine';

import * as express from 'express';
import { Request, Response } from 'express';
import { ROUTES } from './../helpers/routes';
import { JWTKey } from './../helpers/constants';

const port = 8000;
const baseUrl = `http://localhost:${port}`;

const fs = require('fs');
const expressStaticGzip = require('express-static-gzip');
const compression = require('compression');
const bodyParser = require('body-parser');
const credential = require('credential');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const base64Img = require('base64-img');

const db = mongoose.connection;
const app = express();
const pww = credential();

const imageBasePath = 'dist/assets/products/';

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModule
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

app.post('/api/register', (req: Request, res: Response) => {
  pww.hash(req.body.password, (err: any, hash: string) => {
    if (err) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    db.collection('users', (err2: any, collection: any) => {
      if (err2) {
        res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
        return;
      }

      collection.findOne({email: req.body.email.toLowerCase()}, (err3: any, doc: any) => {
        if (err3) {
          res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
          return;
        }

        if (doc) {
          res.json({'error': 'true', 'msg': 'Dit email adres is al geregistreerd!'});
          return;
        } else {
          collection.insertOne({
            firstname: capitalizeFirstLetter(req.body.firstname.toLowerCase()),
            surname_prefix: req.body.surname_prefix.toLowerCase(),
            surname: capitalizeFirstLetter(req.body.surname.toLowerCase()),
            streetname: req.body.streetname.toLowerCase(),
            house_number: req.body.house_number,
            postal_code: req.body.postal_code,
            city: req.body.city,
            country: req.body.country,
            email: req.body.email.toLowerCase(),
            password: String(hash),
            tfatoken : '',
            admin: false
          });
          res.json({'error': 'false'});
        }
      });
    });
  });
});

app.post('/api/login', (req: Request, res: Response) => {
  let verified = true;
  db.collection('users', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    collection.findOne({email: req.body.email.toLowerCase()}, (err3: any, doc: any) => {
      if (err3) {
        res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
        return;
      }

      if (doc) {
        if (doc.tfatoken.length > 0) {
          verified = speakeasy.totp.verify({ secret: doc.tfatoken, encoding: 'base32', token: req.body.tfa });
        }
        pww.verify(doc.password, req.body.password, (err: any, isValid: boolean) => {
          if (err) {
            res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
            return;
          }
          if (isValid && verified) {
            const token = jwt.sign({
              exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
              data: {
                'email': req.body.email.toLowerCase(),
                'admin': doc.admin
              }
            }, JWTKey);
            res.json({'error': 'false', 'data': token});
          } else {
            res.json({'error': 'true', 'msg': 'Inlog gegevens incorrect'});
          }
        });
      } else {
        res.json({'error': 'true', 'msg': 'Inlog gegevens incorrect'});
      }
    });
  });
});

app.post('/api/get_profile', (req: Request, res: Response) => {
  jwt.verify(req.body.token, JWTKey, (err: any, decoded: any) => {
    if (err) {
      res.json({'verify': 'false', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    } else {
      db.collection('users', (err2: any, collection: any) => {
        if (err2) {
          res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
          return;
        }

        collection.findOne({email: decoded.data['email'].toLowerCase()}, (err3: any, doc: any) => {
          if (err3) {
            res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
            return;
          }

          if (doc) {
            res.json({'error': 'false', 'data': doc});
            return;
          } else {{
            res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
            return;
          }}
        });
      });
    }
  });
});

app.post('/api/save_profile', (req: Request, res: Response) => {
  jwt.verify(JSON.parse(req.body[0])['token'], JWTKey, (err: any, decoded: any) => {
    if (err) {
      res.json({'verify': 'false', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    } else {
      db.collection('users', (err2: any, collection: any) => {
        if (err2) {
          res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
          return;
        }

        collection.update({email: decoded.data['email'].toLowerCase()}, { $set: {
            firstname: capitalizeFirstLetter(req.body[1].firstname.toLowerCase()),
            surname_prefix: req.body[1].surname_prefix.toLowerCase(),
            surname: capitalizeFirstLetter(req.body[1].surname.toLowerCase()),
            streetname: req.body[1].streetname.toLowerCase(),
            house_number: req.body[1].house_number,
            postal_code: req.body[1].postal_code,
            city: req.body[1].city,
            country: req.body[1].country
          }
        }, (err3: any) => {
          if (err3) {
            res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
            return;
          }

          res.json({'error': 'false', 'data': 'Uw account is succesvol geüpdatet!'});
          return;
        });
      });
    }
  });
});

app.post('/api/save_password', (req: Request, res: Response) => {
  jwt.verify(JSON.parse(req.body[0])['token'], JWTKey, (err: any, decoded: any) => {
    if (err) {
      res.json({'verify': 'false', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    } else {
      db.collection('users', (err1: any, collection: any) => {
        if (err1) {
          res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
          return;
        }
        collection.findOne({email: decoded.data['email'].toLowerCase()}, (err2: any, doc: any) => {
          if (err2) {
            res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
            return;
          }

          if (doc) {
            pww.verify(doc.password, req.body[1].old_password, (err3: any, isValid: boolean) => {
              if (err2) {
                res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
                return;
              }
              if (isValid) {
                pww.hash(req.body[1].password, (err4: any, hash: string) => {
                  if (err4) {
                    res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
                    return;
                  }

                  collection.update({email: decoded.data['email'].toLowerCase()}, { $set: {
                      password: String(hash)
                    }
                  }, (err5: any) => {
                    if (err5) {
                      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
                      return;
                    }

                    res.json({'error': 'false', 'data': 'Uw wachtwoord is succesvol geüpdatet!'});
                    return;
                  });
                });
              }
            });
          }
        });
      });
    }
  });
});

app.post('/api/verify', (req: Request, res: Response) => {
  jwt.verify(req.body.token, JWTKey, (err: any, decoded: any) => {
    if (err) {
      res.json({'verify': 'false'});
      return;
    }
    res.json({'verify': 'true'});
  });
});

app.post('/api/check_tfa', (req: Request, res: Response) => {
  db.collection('users', (err2: any, collection: any) => {
    if (err2) {
      res.json({'tfa': ''});
      return;
    }
    collection.findOne({email: req.body.email.toLowerCase()}, (err3: any, doc: any) => {
      if (err3) {
        res.json({'tfa': ''});
        return;
      }
      if (doc) {
        res.json({'tfa': doc.tfatoken});
      } else {
        res.json({'tfa': ''});
      }
    });
  });
});

app.get('/api/generate_tfa_token', (req: Request, res: Response) => {
  const secret = speakeasy.generateSecret({length: 32});
  res.json({
    key: secret.base32,
    otpauth_url: secret.otpauth_url
  });
});

app.post('/api/verify_tfa_token', (req: Request, res: Response) => {
  jwt.verify(JSON.parse(req.body.user)['token'], JWTKey, (err: any, decoded: any) => {
    const verified = speakeasy.totp.verify({ secret: req.body.key, encoding: 'base32', token: req.body.token });
    if (err || !verified) {
      res.json({verified: false});
      return;
    }

    db.collection('users', (err2: any, collection: any) => {
      if (err2) {
        res.json({verified: false});
        return;
      }

      collection.update({email: decoded.data['email'].toLowerCase()}, { $set: {
          tfatoken: req.body.key
        }
      }, (err3: any) => {
        if (err3) {
          res.json({verified: false});
          return;
        }
      });
    });

    res.json({
      verified: true
    });
  });
});

app.post('/api/disable_tfa', (req: Request, res: Response) => {
  jwt.verify(req.body.token, JWTKey, (err: any, decoded: any) => {
    if (err) {
      res.json({'res': false});
      return;
    }
    db.collection('users', (err2: any, collection: any) => {
      if (err2) {
        res.json({'res': false});
        return;
      }

      collection.update({email: decoded.data['email'].toLowerCase()}, { $set: {
          tfatoken: ''
        }
      }, (err3: any) => {
        if (err3) {
          res.json({'res': false});
          return;
        }

        res.json({'res': true});
        return;
      });
    });
  });
});

app.post('/api/check_admin', (req: Request, res: Response) => {
  jwt.verify(req.body.token, JWTKey, (err: any, decoded: any) => {
    if (err) {
      res.json({'admin': 'false'});
      return;
    }

    db.collection('users', (err2: any, collection: any) => {
      if (err2) {
        res.json({'admin': 'false'});
        return;
      }
      collection.findOne({email: decoded.data['email'].toLowerCase()}, (err3: any, doc: any) => {
        if (err3) {
          res.json({'admin': 'false'});
          return;
        }
        if (doc) {
          res.json({'admin': doc.admin});
        } else {
          res.json({'admin': 'false'});
        }
      });
    });
  });
});

app.post('/api/add_product', (req: Request, res: Response) => {
  db.collection('products', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    collection.insertOne({
      name: req.body.name,
      price: String(req.body.price).replace(',', '.'),
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category
    }, (err: any, inserted: any) => {
      if (err) {
        res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
        return;
      }

      base64Img.img(req.body.photo, imageBasePath, inserted.insertedId, (err3: any, filepath: string) => {
        if (err3) {
          res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
          return;
        }

        collection.update({_id: new ObjectId(inserted.insertedId)}, { $set: {
            photo: filepath.replace(imageBasePath, '')
          }
        }, (err4: any) => {
          if (err4) {
            res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
            return;
          }

          res.json({'error': 'false', 'msg': 'Product is toegevoegd!'});
        });
      });
    });
  });
});


app.post('/api/update_product', (req: Request, res: Response) => {
  db.collection('products', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    base64Img.img(req.body.photo, imageBasePath, req.body.id, (err3: any, filepath: string) => {
      if (err3) {
        res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
        return;
      }

      collection.update({_id: new ObjectId(req.body.id)}, { $set: {
        name: req.body.name,
        price: String(req.body.price).replace(',', '.'),
        amount: req.body.amount,
        description: req.body.description,
        category: req.body.category,
        photo: filepath.replace(imageBasePath, '')
      }
      }, (err4: any) => {
        if (err4) {
          res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
          return;
        }

        res.json({'error': 'false', 'msg': 'Product is aangepast!'});
      });
    });
  });
});

app.post('/api/delete_product', (req: Request, res: Response) => {
  db.collection('products', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': err2.message});
      return;
    }

    collection.deleteOne({_id: new ObjectId(req.body.id)});

    res.json({'error': 'false'});
  });
});

app.get('/api/products/:amount', (req: Request, res: Response) => {
  // tslint:disable-next-line:radix
  const amount = parseInt(req.params.amount);

  if (amount === NaN) {
    res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
    return;
  }

  db.collection('products', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    collection.find().sort({_id: -1}).limit(amount).toArray((err3: any, items: any) => {
      res.send(items);
    });
  });
});

app.get('/api/product/:id', (req: Request, res: Response) => {
  db.collection('products', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }
    if (req.params.id.length === 12 || req.params.id.length === 24) {
    collection.findOne({_id: new ObjectId(req.params.id)}, (err3: any, items: any) => {
      if (items) {
        res.json(items);
      } else {
        res.json({'error': 'true', 'msg': 'Not found'});
      }
    });
    } else {
      res.json({'error': 'true', 'msg': 'Not found'});
    }
  });
});

app.get('/api/categories', (req: Request, res: Response) => {
  db.collection('categories', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    collection.find().sort({_id: -1}).toArray((err3: any, items: any) => {
      res.send(items);
    });
  });
});

app.post('/api/add_category', (req, res: Response) => {
  db.collection('categories', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    collection.insertOne({
      category: req.body.name
    });

    res.json({'error': 'false', 'msg': 'Categorie is toegevoegd!'});
  });
});

app.post('/api/update_category', (req: Request, res: Response) => {
  db.collection('categories', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true'});
      return;
    }

    collection.update({_id: new ObjectId(req.body.id)}, { $set: {
        category: req.body.category
      }
    }, (err3: any) => {
      if (err3) {
        res.json({'error': 'true'});
        return;
      }

      res.json({'error': 'false'});
      return;
    });
  });
});

app.post('/api/delete_category', (req: Request, res: Response) => {
  db.collection('categories', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': err2.message});
      return;
    }

    collection.deleteOne({_id: new ObjectId(req.body.id)});

    res.json({'error': 'false'});
  });
});

app.post('/api/stats_page', (req: Request, res: Response) => {
  db.collection('stats', (err: any, collection: any) => {
    if (err) {
      res.json({'error': 'true', 'msg': err.message});
      return;
    }

    collection.insertOne({
      date: new Date().setHours(0, 0, 0, 0),
      page: req.body.page
    }, (err2: any, result: any) => {
      if (err2) {
        res.json({'error': 'true', 'msg': err2.message});
        return;
      }

      res.json({'error': 'false'});
    });
  });
});

app.post('/api/stats_product', (req: Request, res: Response) => {
  db.collection('stats', (err: any, collection: any) => {
    if (err) {
      res.json({'error': 'true', 'msg': err.message});
      return;
    }

    collection.insertOne({
      date: new Date().setHours(0, 0, 0, 0),
      product: req.body.product
    }, (err2: any, result: any) => {
      if (err2) {
        res.json({'error': 'true', 'msg': err2.message});
        return;
      }

      res.json({'error': 'false'});
    });
  });
});

app.get('/api/total_stats', (req: Request, res: Response) => {
  db.collection('users', (err: any, collection: any) => {
    if (err) {
      res.json({'error': 'true', 'msg': err.message});
      return;
    }

    collection.count({}, (err2: any, numOfDocs: any) => {
      if (err2) {
        res.json({'error': 'true', 'msg': err2.message});
        return;
      }

      db.collection('stats', (err3: any, collection2: any) => {
        if (err3) {
          res.json({'error': 'true', 'msg': err3.message});
          return;
        }

        collection2.find({page: {$exists: true}}).count({}, (err4: any, numOfViews: any) => {
          if (err4) {
            res.json({'error': 'true', 'msg': err4.message});
            return;
          }

          collection2.find({product: {$exists: true}}).count({}, (err5: any, numOfProductViews: any) => {
            if (err5) {
              res.json({'error': 'true', 'msg': err5.message});
              return;
            }

            res.json({'error': 'false', 'usercount': numOfDocs, 'pageviews': numOfViews, 'productviews': numOfProductViews});
          });
        });
      });
    });
  });
});

app.get('/api/range_stats', (req: Request, res: Response) => {
  const from: string = req.query.from.replace('/', '');
  const to: string = req.query.to.replace('/', '');

  db.collection('stats', (err: any, collection: any) => {
    if (err) {
      res.json({'error': 'true', 'msg': err.message});
      return;
    }

    collection.find({date: { $gt: Number(from), $lt: Number(to)}}).toArray((err2: any, items: any) => {
      if (err2) {
        res.json({'error': 'true', 'msg': err2.message});
        return;
      }

      res.send(items);
    });
  });
});

app.post('/api/contact', (req: Request, res: Response) => {
  db.collection('messages', (err: any, collection: any) => {
    if (err) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    collection.insertOne({
      to: 'admin',
      date: new Date(),
      firstname: req.body.firstname,
      surname_prefix: req.body.surname_prefix,
      surname: req.body.surname,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      read: false
    }, (err2: any, inserted: any) => {
      if (err2) {
        res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
        return;
      }

      res.json({'error': 'false'});
    });
  });
});

app.get('/api/get_messages/:receiver', (req: Request, res: Response) => {
  const receiver = req.params.receiver;

  db.collection('messages', (err: any, collection: any) => {
    if (err) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    collection.find({'to': receiver}).sort({_id: -1}).toArray((err2: any, items: any) => {
      res.send(items);
    });

  });
});

app.get('/api/get_unread_messages/:receiver', (req: Request, res: Response) => {
  const receiver = req.params.receiver;

  db.collection('messages', (err: any, collection: any) => {
    if (err) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    collection.find({'to': receiver, read: false}).count({}, (err2: any, numOfDocs: any) => {
      if (err2) {
        res.json({'error': 'true', 'msg': err2.message});
        return;
      }

      res.json({'error': 'false', 'count': numOfDocs});
    });
  });
});

app.get('/api/mark_read_messages/:id', (req: Request, res: Response) => {
  db.collection('messages', (err: any, collection: any) => {
    if (err) {
      res.json({'error': 'true'});
      return;
    }

    collection.update({_id: new ObjectId(req.params.id)}, { $set: {
        read: true
      }
    }, (err2: any) => {
      if (err2) {
        res.json({'error': 'true'});
        return;
      }

      res.json({'error': 'false'});
    });
  });
});

app.get('*.png', (req: Request, res: Response) => {
  const img = fs.readFileSync(process.cwd() + '/dist/assets/img/no_image.jpg');
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

app.get('*', (req: Request, res: Response) => {
  res.redirect('/404');
});

mongoose.connect('mongodb://localhost:27017/ingrid');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (err: any, database: any) => {
  if (err) {
    return console.log(err);
  }

  app.listen(port, () => {
    console.log(`Listening at ${baseUrl}`);
  });
});
