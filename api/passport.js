'use strict'

const errors = require('./errors');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const passport = require('passport');
const SECRET = 'SEKR37';
const Promise = require('bluebird');

class PassportController {
    constructor(adminController, log) {
        this.adminController = adminController;
        this.passport = passport;
        this.log = log;
        this.log.debug('Initializing passport controller');
        
        this.passport.serializeUser((user, done) => {
            done(null, user._id);
        });
    
        // used to deserialize the user
        this.passport.deserializeUser((id, done) => {
            this.adminController.getById(id).then((user) => {
                if (user) {
                    done(null, user);
                } else {
                    done('Null user');
                }
            }).catch((error) => {
                done(error);
            });
        });
    
        this.passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with nickname
            usernameField : 'nickname',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        }, (req, nickname, password, done) => {
            this.log.debug("login : " + nickname);
            const loginObj = { nickname : nickname, password : password };
            let token = null;
            this.adminController.login(loginObj).then((user) => {
                token = this.createToken(user);
                if (user.tokens != null && user.tokens.indexOf(token) < 0) {
                    user.tokens.push(token);
                } else {
                    user.tokens = [token];
                }
                return this.adminController.update(user._id, {tokens : user.tokens});
            }).then((result) => {
                result.token = token;
                this.log.debug("login result: " + JSON.stringify(result));
                return done(null, result);
            }).catch((error) => {
                this.log.error(error);
                return done(error);
            });
        }));
    }

    createToken(user) {
        return jwt.sign({
            id: user._id,
        }, SECRET, {
            expiresIn: 120
        });
    }

    isLoggedIn(req, res, next) {
        if (req.headers != null && req.headers['x-access-token'] != null) {
            const token = req.headers['x-access-token'];
            this._getUserByToken(token, req).then((user) => {
                if (user != null) {
                    this.log.error('Authenticated via header with user ' + JSON.stringify(user));
                    return next();
                } else {
                    res.status(401).send(errors.getUnauthorized());
                }
            }).catch((error) => {
                res.status(401).send(errors.getUnauthorized());
            });
            return;
        }

        if (req.isAuthenticated()) {
            return next();
        }

        res.status(401).send(errors.getUnauthorized());
    }

    _getUserByToken(token, req) {
        return this.validateToken(token).then((decodedJwt) => {
            req.decoded = decodedJwt;
            return this.adminController.getByCriteria({tokens : token});
        }).then((users) => {
            this.log.debug('User found: ' + JSON.stringify(users));
            if (users.length > 0) {
                return users[0];
            }
        }).catch((error) => {
            return null;
        });
    }

    validateToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, SECRET, (err, decoded) => {      
                if (err) {
                    this.log.error(error);
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    authenticate(request, response, next) {
        this.log.debug('Authenticating');
        this.passport.authenticate('local-login', (error, user) => {
            this.log.debug('Authenticating...');
            if (error != null) {
                this.log.error('error: ' + JSON.stringify(error));
                response.status(401).send(error);
                return;
            }
            request.login(user, (error) => {
                if (error != null) {
                    this.log.error('error on login: ' + error);
                    response.status(401).send(error);
                    return;
                }
                this.log.debug('login : ' + JSON.stringify(user));
                
                response.send(user);
                next();
            });
        })(request, response, next);
    }
}

module.exports = PassportController;
