import { Request, Response } from 'express';

import { JWTKey } from '../../helpers/constants';

const jwt = require('jsonwebtoken');
const credential = require('credential');
const speakeasy = require('speakeasy');

import IBaseController = require('./BaseController');
import UsersBusiness = require('../app/business/UsersBusiness');
import IUsersModel = require('../app/model/interfaces/IUsersModel');

const pww = credential();

class UsersController implements IBaseController<UsersBusiness> {
  create(req: Request, res: Response): void {
    try {
      const user: IUsersModel = <IUsersModel>req.body;
      const userBusiness = new UsersBusiness();
      userBusiness.create(user, (error, result) => {
        res.send({'error': error ? 'true' : 'false'});
      });
    } catch (e)  {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user: IUsersModel = <IUsersModel>req.body.data;
      const userJwt: string = req.body.user;
      const userBusiness = new UsersBusiness();

      const email = await new Promise((resolve, reject) => {
        jwt.verify(JSON.parse(userJwt)['token'], JWTKey, (error: any, decoded: any) => {
          if (error) {
            reject(new Error('Error decoding JWT'));
          } else {
            resolve(decoded.data['email']);
          }
        });
      });

      userBusiness.updateByEmail(String(email), user, (error, result) => {
        res.send({'error': error ? 'true' : 'false'});
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const user: IUsersModel = <IUsersModel>req.body.data;
      const userJwt: string = req.body.user;
      const oldPassword: string = user['old_password'];
      const newPassword: string = user['password'];
      const userBusiness = new UsersBusiness();

      const email = await new Promise((resolve, reject) => {
        jwt.verify(JSON.parse(userJwt)['token'], JWTKey, (error: any, decoded: any) => {
          if (error) {
            reject(new Error('Error decoding JWT'));
          } else {
            resolve(decoded.data['email']);
          }
        });
      });

      const getOldPassword = await new Promise((resolve, reject) => {
        userBusiness.findByEmail(String(email), (error, result) => {
          if (error) {
            reject(new Error('User not found'));
          } else {
            resolve(result['password']);
          }
        });
      });

      const validPassword = await new Promise((resolve, reject) => {
        pww.verify(String(getOldPassword), oldPassword, (error: any, isValid: boolean) => {
          if (error) {
            reject(new Error('Unkown error'));
          } else {
            resolve(isValid);
          }
        });
      });

      if (validPassword) {
        pww.hash(newPassword, (error: any, hashed: string) => {
          if (error) {
            res.send({'error': 'true'});
          } else {
            // tslint:disable-next-line:no-shadowed-variable
            userBusiness.updateByEmail(String(email), <IUsersModel> { password: hashed }, (error, result) => {
              res.send({'error': error ? 'true' : 'false'});
            });
          }
        });
      } else {
        res.json({'error': 'true', 'msg': 'Uw oude wachtwoord is incorrect!'});
      }
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  delete(req: Request, res: Response): void {
    try {
      const _id: string = req.params._id;
      const userBusiness = new UsersBusiness();
      userBusiness.delete(_id, (error, result) => {
        res.send({'error': error ? 'true' : 'false'});
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  retrieve(req: Request, res: Response): void {
    try {
      const userBusiness = new UsersBusiness();
      userBusiness.retrieve((error, result) => {
        if (error) {
          res.send({'error': 'true'});
        } else {
          res.send(result);
        }
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  findById(req: Request, res: Response): void {
    try {
      const _id: string = req.params._id;
      const userBusiness = new UsersBusiness();
      userBusiness.findById(_id, (error, result) => {
        if (error) {
          res.send({'error': 'true'});
        } else {
          res.send(result);
        }
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  async findByEmail(req: Request, res: Response) {
    try {
      const email = await new Promise((resolve, reject) => {
        jwt.verify(req.body.token, JWTKey, (err: any, decoded: any) => {
          if (err) {
            reject(new Error('Token invalid'));
          } else {
            resolve(decoded.data['email']);
          }
        });
      });

      const userBusiness = new UsersBusiness();
      userBusiness.findByEmail(String(email), (error, result) => {
        if (error) {
          res.send({'error': 'true'});
        } else {
          result.password = null;
          res.send({'error': 'false', 'data': result});
        }
      });
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  generateToken(req: Request, res: Response): void {
    const secret = speakeasy.generateSecret({length: 32});
    res.send({
      key: secret.base32,
      otpauth_url: secret.otpauth_url
    });
  }

  async verifyTokenAndSave(req: Request, res: Response) {
    try {
      const userJwt: string = req.body.user;
      const key: string = req.body.key;
      const token: string = req.body.token;
      const email = await new Promise((resolve, reject) => {
        jwt.verify(JSON.parse(userJwt)['token'], JWTKey, (error: any, decoded: any) => {
          if (error) {
            reject(new Error('Error decoding JWT'));
          } else {
            resolve(decoded.data['email']);
          }
        });
      });

      const verified = speakeasy.totp.verify({ secret: key, encoding: 'base32', token: token });

      if (verified) {
        const userBusiness = new UsersBusiness();
        userBusiness.updateByEmail(String(email), <IUsersModel> { tfatoken: key }, (error, result) => {
          res.send({'error': error ? 'true' : 'false'});
        });
      } else {
        res.send({'error': 'true', 'msg': 'Token is incorrect'});
      }

    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  async checkTfa(req: Request, res: Response) {
    try {
      const email: string = req.body.email.toLowerCase();

      const userBusiness = new UsersBusiness();
      const user = await new Promise((resolve, reject) => {
        userBusiness.findByEmail(email, (error, result) => {
          if (error) {
            reject(new Error('User not found'));
          } else {
            resolve(result);
          }
        });
      });

      if (user) {
        res.json({'tfa': user['tfatoken']});
      } else {
        res.json({'tfa': ''});
      }
    } catch (e) {
    console.log(e);
    res.send({'error': 'true'});
    }
  }

  async login(req: Request, res: Response) {
    try {
      let verified = true;

      const email: string = req.body.email.toLowerCase();
      const password: string = req.body.password.toLowerCase();
      const token: string = req.body.tfa.toLowerCase();

      const userBusiness = new UsersBusiness();
      const user = await new Promise((resolve, reject) => {
        userBusiness.findByEmail(email, (error, result) => {
          if (error) {
            reject(new Error('User not found'));
          } else {
            resolve(result);
          }
        });
      });

      if (user['tfatoken'].length > 0) {
        verified = speakeasy.totp.verify({ secret: user['tfatoken'], encoding: 'base32', token: token });
      }

      const valid = await new Promise((resolve, reject) => {
        pww.verify(user['password'], password, (error: any, isValid: boolean) => {
          if (error) {
            reject(new Error('Password not valid'));
            return;
          } else {
            resolve(isValid);
          }
        });
      });

      if (valid && verified) {
        const resultToken = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
          data: {
            'email': email,
            'admin': user['admin']
          }
        }, JWTKey);
        res.send({'error': 'false', 'data': resultToken});
      } else if (!valid && !verified) {
        res.send({'error': 'true', 'msg': 'Wachtwoord en token zijn incorrect!'});
      } else if (!valid) {
        res.send({'error': 'true', 'msg': 'Wachtwoord is incorrect!'});
      } else if (!verified) {
        res.send({'error': 'true', 'msg': 'Token is incorrect!'});
      } else {
        res.send({'error': 'true'});
      }
    } catch (e) {
      console.log(e);
      res.send({'error': 'true'});
    }
  }

  verify(req: Request, res: Response) {
    jwt.verify(req.body.token, JWTKey, (err: any, decoded: any) => {
      res.send({'verify': err ? 'false' : 'true'});
    });
  }
}

export = UsersController;
