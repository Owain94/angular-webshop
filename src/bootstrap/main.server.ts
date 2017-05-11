import '../polyfills/polyfills.server';
import { AppServerModule } from './../app/modules/app.server.module';
import { ngExpressEngine } from './../app/modules/ng-express-engine/express-engine';

import * as express from 'express';
import { ROUTES } from './../helpers/routes';
import { JWTKey } from './../helpers/constants';

const port = 8000;
const baseUrl = `http://localhost:${port}`;

const compression = require('compression');
const bodyParser = require('body-parser');
const credential = require('credential');
const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const base64Img = require('base64-img');

let db: any;
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

app.get('/', (req, res) => {
  res.render('index', {req});
});

app.use(compression());
app.use('/', express.static('dist', {index: false}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

ROUTES.forEach(route => {
  app.get(route, (req, res) => {
    res.render('index', {
      req: req,
      res: res
    });
  });
});

app.post('/api/register', (req, res) => {
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
          collection.insert({
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

app.post('/api/login', (req, res) => {
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

app.post('/api/get_profile', (req, res) => {
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

app.post('/api/save_profile', (req, res) => {
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

app.post('/api/save_password', (req, res) => {
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

app.post('/api/verify', (req, res) => {
  jwt.verify(req.body.token, JWTKey, (err: any, decoded: any) => {
    if (err) {
      res.json({'verify': 'false'});
      return;
    }
    res.json({'verify': 'true'});
  });
});

app.post('/api/check_tfa', (req, res) => {
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

app.get('/api/generate_tfa_token', (req, res) => {
  const secret = speakeasy.generateSecret({length: 32});
  res.json({
    key: secret.base32,
    otpauth_url: secret.otpauth_url
  });
});

app.post('/api/verify_tfa_token', (req, res) => {
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

app.post('/api/disable_tfa', (req, res) => {
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

app.post('/api/check_admin', (req, res) => {
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

app.post('/api/add_product', (req, res) => {
  db.collection('products', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    collection.insert({
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

      base64Img.img(req.body.photo, imageBasePath, inserted.insertedIds[0], (err3: any, filepath: string) => {
        if (err3) {
          res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
          return;
        }

        collection.update({_id: new ObjectId(inserted.insertedIds[0])}, { $set: {
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


app.post('/api/update_product', (req, res) => {
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

app.post('/api/delete_product', (req, res) => {
  db.collection('products', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': err2.message});
      return;
    }

    collection.deleteOne({_id: new ObjectId(req.body.id)});

    res.json({'error': 'false'});
  });
});

app.get('/api/products/:amount', (req, res) => {
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


app.get('/api/product/:id', (req, res) => {
  db.collection('products', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    collection.find({_id: new ObjectId(req.params.id)}).toArray((err3: any, items: any) => {
      res.send(items);
    });
  });
});

app.get('/api/categories', (req, res) => {
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

app.post('/api/add_category', (req, res) => {
  db.collection('categories', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': 'Een onbekende fout is opgetreden, probeer het later nog eens.'});
      return;
    }

    collection.insert({
      category: req.body.name
    });

    res.json({'error': 'false', 'msg': 'Categorie is toegevoegd!'});
  });
});

app.post('/api/update_category', (req, res) => {
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

app.post('/api/delete_category', (req, res) => {
  db.collection('categories', (err2: any, collection: any) => {
    if (err2) {
      res.json({'error': 'true', 'msg': err2.message});
      return;
    }

    collection.deleteOne({_id: new ObjectId(req.body.id)});

    res.json({'error': 'false'});
  });
});

app.post('/api/stats_page', (req, res) => {
  db.collection('stats', (err: any, collection: any) => {
    if (err) {
      res.json({'error': 'true', 'msg': err.message});
      return;
    }

    collection.insert({
      date: new Date().setHours(0, 0, 0, 0),
      page: req.body.page
    });

    res.json({'error': 'false'});
  });
});

app.post('/api/stats_product', (req, res) => {
  db.collection('stats', (err: any, collection: any) => {
    if (err) {
      res.json({'error': 'true', 'msg': err.message});
      return;
    }

    collection.insert({
      date: new Date().setHours(0, 0, 0, 0),
      product: req.body.product
    });

    res.json({'error': 'false'});
  });
});

app.get('*', function(req, res){
  res.redirect('/404');
});

mongo.connect('mongodb://localhost:27017/ingrid', (err: any, database: any) => {
  if (err) {
    return console.log(err);
  }

  db = database;
  app.listen(port, () => {
    console.log(`Listening at ${baseUrl}`);
  });
});
