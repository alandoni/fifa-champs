"use strict"

const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, adminController) {

	passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        adminController.getById(id).then((user) => {
            if (!user) {
                done('Null user');
            } else {
                done(null, user);
            }
        }).catch((error) => {
        	done(error);
        });
    });

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with nickname
        usernameField : 'nickname',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, (req, nickname, password, done) => {

		const loginObj = {nickname: nickname, password: password};

        adminController.login(loginObj).then((result) => {
    		return done(null, result);
    	}).catch((error) => {
    		return done(error);
    	});
    }));
};
