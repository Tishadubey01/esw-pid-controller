var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var Users = require('./model/user')
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

passport.use('userLocal', new LocalStrategy({usernameField: 'email'},Users.authenticate()));

// when user logins - transfer JWT token
passport.serializeUser(function(user, done) {
    done(null, user);
});

// when user logout - read & write JWT token
passport.deserializeUser(function(user, done) {
    if(user!=null)
        done(null,user);
});

exports.getToken = function(user) {
    return jwt.sign(user, 'secret',
        {expiresIn: "12h"});
};

var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use('userJWT',new JwtStrategy(opts, function(jwt_payload, done) {
    Users.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            console.log(user);
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

exports.verifyUser = passport.authenticate('userJWT', {session: false});
