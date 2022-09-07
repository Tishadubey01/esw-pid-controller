const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const passport = require('passport');
const Users = require('../model/user');
const authenticate = require('../authenticate');
// const { resolveHostname } = require('nodemailer/lib/shared');
const userRouter = express.Router();
const singleLogin = require('../model/singleLogin')

userRouter.use(bodyParser.json());


// GET all Users data
userRouter.route('/')
    .get((req, res, next) => { 
        Users.find({})
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            },
                (err) => next(err))
            .catch((err) => next(err));
    })


userRouter.route('/me')
.get(authenticate.verifyUser, (req, res, next) => {
    Users.findById(req.user._id)
        .then((users) => {
            console.log(users);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err))
})

// SIGNUP a new user
userRouter.post('/signup', (req, res, next) => {
    var password = req.body.password;
    delete req.body.password;

    Users.register(new Users(req.body), 
        password, (err, user) => {
            if (err) {
                console.log(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); 
                res.json({ success: true, status: 'Registration Successful!' });
            }
        });
});


// // LOGIN as USER
// userRouter.post('/login', passport.authenticate('userLocal'), (req, res,  next) => {
//     // singleLogin.find({})
//     //     .then((login) => {
//             // if (!login) {
//             //     singleLogin.create()
//             //         .then((newlogin) => {
//             //             newlogin.islogin = true;
//             //             newlogin.save();
                        
//             //             const token = authenticate.getToken({ _id: req.user._id });
//             //             res.statusCode = 200;
//             //             Users.find(); 
//             //             res.setHeader('Content-Type', 'application/json'); 
//             //             return res.json({ success: true, token: token, userType: "user", status: 'You are successfully logged in!' });
//             //         } 
//             //     );
//             // }
//             // if (login.islogin == true) {

//             //     res.statusCode = 400;
//             //     res.setHeader('Content-Type', 'application/json'); 
//             //     res.json({ success: true, status: 'Oops, someone is already logged in!' });    
//             // }else {
//             //     login.islogin = true;
//             //     login.save();
                
//                 const token = authenticate.getToken({ _id: req.user._id });
//                 res.statusCode = 200;
//                 Users.find(); 
//                 res.setHeader('Content-Type', 'application/json'); 
//                 res.json({ success: true, token: token, userType: "user", status: 'You are successfully logged in!' });
//             // }
//         // },
// },
//             (err) => next(err))
//         .catch((err) => next(err));

//     });


// LOGIN as USER
userRouter.post('/login', passport.authenticate('userLocal'), (req, res) => {   
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    Users.find(); 
    res.setHeader('Content-Type', 'application/json'); 
    res.json({ success: true, token: token, userType: "user", status: 'You are successfully logged in!' });
});



// LOGOUT as USER
userRouter.post('/logout', passport.authenticate('userLocal'), (req, res) => {
    // singleLogin.find({})
    //     .then((login) => {
    //         if (login.islogin == true) {
    //             login.islogin = false;
    //             login.save();

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json'); 
                res.json({ success: true, status: 'You are successfully logged out in!' });    
        //     }
        // },
        //     (err) => next(err))
        // .catch((err) => next(err));

    });



module.exports = userRouter;