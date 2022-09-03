const express=require('express');
const router=express.Router();
const mongoose=require("mongoose")
//const User=mongoose.model("User")
const User = require("../models/User");
const Stat = require("../models/Stat");
router.get('/signup',(req,res)=>{
      res.send("bye");
})
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authentication = require('../middleware/authentication');
//Generate a token if a user registers.
//Throws an error if the user is already been registered using email-id.
router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
      
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        

        
        const {
            username,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: '1h'
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

//LOGIN////////
//Check if the user exists or not
//Also checks for the password.
//Will generate a token if logged in.
router.post(
      "/login",
      [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
          min: 6
        })
      ],
      async (req, res) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array()
          });
        }
        const { email, password } = req.body;
        try {
          // let stat = await Stat.find({});
          // console.log(stat);
          // if(stat.length > 0){
          //   return res.status(400).json({
          //         message: "A user is already logged in"
          //   });
          // }
          let user = await User.findOne({
            email
          });
          if (!user)
            return res.status(400).json({
              message: "User Not Exist"
            });
    
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch)
            return res.status(400).json({
              message: "Incorrect Password !"
            });
          else
          {
            res.send(user._id);
            return user._id;
          }
    
          // const payload = {
          //   user: {
          //     id: user._id
          //   }
          // };
    
          // let newStat = new Stat({
          //   userId: user._id,
          // })
          // newStat.save()
          // .then(()=>{
            
          //         jwt.sign(
          //               payload,
          //               "secret",
          //               {
          //               expiresIn: 3600
          //               },
          //               (err, token) => {
          //               if (err) throw err;
          //               res.status(200).json({
          //               token
          //               });
          //               }
          //         );
            
          //   })
          //   .catch(() => {
          //         res.status(400).send({
          //               "error": "Error while saving session"
          //         } )
          //   })
        } catch (e) {
          console.error(e);
          res.status(500).json({
            message: "Server Error"
          });
        }
      }
    );


// router.post("/login", (req, res) => {

//   const email = req.body.email;
//   const pass = req.body.password;
//   //const password = req.body.password;
//   // Find user by email
//   User.findOne({ email }).then(user => {
//       // Check if user exists
//       if (!user) {

//           return res.status(404).send("user not found");
//       }

//       const isMatch = await bcrypt.compare(pass, user.password);
//       if (!isMatch)
//         return res.status(400).json({
//           message: "Incorrect Password!"
//         });
//       else
//       {
//         res.send(user._id);
//         return user._id;

//       }


//       // else {
//       //     if (pass === user.password) {
//       //         res.send(user._id);
//       //         return user._id;
//       //     }
//       //     else {
//       //         return res.status(404).send("password is incorrect");
//       //     }
//       // }
//   });
// });



router.get("/logout", authentication, async (req, res) => {
      try {
            await Stat.findOneAndDelete({
                  userId: req.user.id,
            })

            // await Stat.deleteMany({})

            res.json({
                  message: "Logout Success",
            });

      } catch (e) {
        res.send({ message: "Error in Logging out" });
      }
    });
    
//Will return the user if passed the generated token.
router.get("/getdetail", authentication, async (req, res) => {
      try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.user.id);
        res.json(user);
      } catch (e) {
        res.send({ message: "Error in Fetching user" });
      }
    });


    // GET request
// Getting user info from user id  
//its like doing localhost:3000/users/1  , this would give you the info of user with id 1
router.get("/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id, function (err, user) {
      if (err) {
          res.json("");
      } else {
          res.json(user);
      }
  })
});


module.exports = router;


// router.post("/user/signup", (req, res) => {
//       const data = req.body;
//       let user = new User({
//         email: data.email,
//         password: data.password,

//       });
//       user.save()
//             .then(()=>{
//                 res.json({message:"Saved Successfully"})
//                 console.log('successful');
//                 const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
//           res.json({
//             token: token,
//           });
//       })
//         .catch((err) => {
//           user
//             .delete()
//             .then(() => {
//               res.status(400).json(err);
//             })
//             .catch((err) => {
//               res.json({ error: err });
//             });
//           err;
//         });
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
//});

// router.post("/login", (req, res, next) => {
//   passport.authenticate(
//     "local",
//     { session: false },
//     function (err, user, info) {
//       if (err) {
//         return next(err);
//       }
//       if (!user) {
//         res.status(401).json(info);
//         return;
//       }
//       // Token
//       const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
//       res.json({
//         token: token,
//         type: user.type,
//       });
//     }
//   )(req, res, next);
// });

// router.post('/signup',(req,res)=>{
//       var {name,email,password}=req.body
//       console.log(req.body)
//       if(!email || !password || !name)
//       {
//           return res.status(422).json({error:"Add all data"})
//       }

      
//             User.findOne({email:data.email})
//            .then((savedUser)=>{
//                if(savedUser){
//                     return res.status(422).json({error:"User already exists with that email"})
//                }
//                const user=new User({
//                 email,
//                 password,
//                 name,
//             })
//             user.save()
//             .then((user)=>{
//                 res.json({message:"Saved Successfully"})
//                 console.log(user.email)
//             })
//             .catch((err)=>{
//                 console.log(err)
//             })
//         })
//         .catch((err)=>{
//             console.log(err)
//         })
//         })
        
// module.exports=router;