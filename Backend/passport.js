"use strict"

const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, playerController) {

	passport.serializeUser(function(user, done) {

		//console.log("Trying to serialize user " + user);

        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {

    	//console.log("Trying to deserialize user " + id);

        playerController.getById(id).then((user) => {
            done(null, user);
        }).catch((error) => {
            //console.log(error);
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
    	
        playerController.login(loginObj).then((result) => {
    		return done(null, result);
    	}).catch((error) => {
            //console.log(error);
    		return done(error);
    	});
    }));
};