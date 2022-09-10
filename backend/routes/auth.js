const express=require('express');
const router=express.Router();
const mongoose=require("mongoose")
//const User=mongoose.model("User")
const Slot = require("../models/Slot");
const User = require("../models/User");

const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authentication = require('../middleware/authentication');

// dev purposes
router.get('/createslots',(req,res)=>{
  const slots = [
    {
      order: 1,
      start: "10:00", 
      end: "10:59",
      users: [], 
    },
    {
      order: 2,
      start: "11:00", 
      end: "11:59",
      users: [], 
    },
    {
      order: 3,
      start: "12:00", 
      end: "12:59",
      users: [], 
    },
    {
      order: 4,
      start: "13:00", 
      end: "13:59",
      users: [], 
    },
    {
      order: 5,
      start: "14:00", 
      end: "14:59",
      users: [], 
    },
    {
      order: 6,
      start: "15:00", 
      end: "15:59",
      users: [], 
    },
    {
      order: 7,
      start: "16:00", 
      end: "16:59",
      users: [], 
    },
    {
      order: 8,
      start: "17:00", 
      end: "17:59",
      users: [], 
    },
  ]
  Slot.deleteMany({})
  .then( () => {
      Slot.create(slots)
      .then(() => res.send("Slots created"))
      .catch(() => res.send("Error in slots creation"))
    }
  )
  .catch(() => res.send("Error in slots creation"))
})

router.post('/assignslots', [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
 async (req,res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  const { email, password, slotId } = req.body;

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

  const currTime = new Date(Date.now());
  const slots = await Slot.findOne({"_id": slotId});
  if(slots != null){
    if(slots.users.length == 0){
      slots.users = [{
        userId: user.id,
        date: currTime
      }]
    }
    else{
      const lastUser = slots.users[slots.users.length-1];
      if(lastUser.date.toISOString().split("T")[0] != currTime.toISOString().split("T")[0] ){
        slots.users = [...slots.users, {
          userId: user.id,
          date: currTime
        }]
      }
      else{
        res.status(400).json({
              error: "Slot is unavailable"
          });
        return;
      }
    }
    slots.save()
    .then(() => 
      res.json({
        message: "Slot assigned successfully"
      })
    )
    .catch(() => 
      res.status(400).json({
        error:  "Slot is unavailable"
      })
    )
  }
  else{
      res.status(400).json({
          error: "Error"
      });
    }
})



router.get('/getslots',async (req,res) => {
  const currTime = new Date(Date.now());
  let slots = await Slot.find();
  if(slots != null){
    slots = slots.map((obj) => {
      let isEmpty = false;
      if(obj.users.length == 0) isEmpty = true;
      else {
        const lastUser = obj.users[obj.users.length-1];
        if(lastUser.date.toISOString().split("T")[0] != currTime.toISOString().split("T")[0] ){
          isEmpty = true;
        }
      }
      return {
        slotId: obj._id,
        start: obj.start,
        end: obj.end,
        isEmpty: isEmpty
      }
    })
    res.json(slots);
  }
  else{
    res.status(400).json({
        error: "Error, no slot found"
    });
  }
})


router.get('/getfreeslots', async (req,res) => {
  const currTime = new Date(Date.now());
  let slots = await Slot.find();
  if(slots != null){
    slots = slots.map((obj) => {
      let isEmpty = false;
      if(obj.users.length == 0) isEmpty = true;
      else {
        const lastUser = obj.users[obj.users.length-1];
        if(lastUser.date.toISOString().split("T")[0] != currTime.toISOString().split("T")[0] ){
          isEmpty = true;
        }
      }
      if (isEmpty == true) {
        console.log(obj)
        return {
          slotId: obj._id,
          start: obj.start,
          end: obj.end,
          isEmpty: isEmpty
        }
      }
    })
    res.json(slots);
  }
  else{
    res.status(400).json({
        error: "Error, no free slot found"
    });
  }
})

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
    const currTime = new Date(Date.now());
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const { email, password } = req.body;
    try {
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

      const payload = {
        user: {
          id: user.id
        }
      };

      let slots = await Slot.find();
      if(slots != null){
        // console.log(slots)
        slots = slots.filter(obj => 
          obj.users.some(eleUser => {
             return (eleUser.userId == user.id) && (eleUser.date.toISOString().split("T")[0] == currTime.toISOString().split("T")[0]) 
          })
        )
        // console.log(slots)
        // check if current time is within the slot
        let currentHour = currTime.getHours();
        let currentMin = currTime.getMinutes();
        if(slots.some(slot => {
          const hourBegin = parseInt(slot.start.substr(0, 2));
          const minuteBegin = parseInt(slot.start.substr(3, 2));
          const hourEnd = parseInt(slot.end.substr(0, 2));
          const minuteEnd = parseInt(slot.end.substr(3, 2));
          return (currentHour >= hourBegin && currentHour <= hourEnd && currentMin >= minuteBegin && currentMin <= minuteEnd)
        })) {
          jwt.sign(
            payload,
            "secret",
            {
            expiresIn: 3600
            },
            (err, token) => {
            if (err) {
                res.status(400).json({
                message: "Error"
              });;
            }
            res.status(200).json({
              token
            });
            }
          );
        }
        else {       
          res.status(404).json({
            message: "Error, incorrect slot."
          });
        }
      }
      else {       
        res.status(404).json({
          message: "Error, no slots found"
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);


// //LOGIN////////
// //Check if the user exists or not
// //Also checks for the password.
// //Will generate a token if logged in.
// router.post(
//       "/login",
//       [
//         check("email", "Please enter a valid email").isEmail(),
//         check("password", "Please enter a valid password").isLength({
//           min: 6
//         })
//       ],
//       async (req, res) => {
//         const errors = validationResult(req);
    
//         if (!errors.isEmpty()) {
//           return res.status(400).json({
//             errors: errors.array()
//           });
//         }
//         const { email, password } = req.body;
//         try {
//           let stat = await Stat.find({});
//           console.log(stat);
//           if(stat.length > 0){
//             return res.status(400).json({
//                   message: "A user is already logged in"
//             });
//           }
//           let user = await User.findOne({
//             email
//           });
//           if (!user)
//             return res.status(400).json({
//               message: "User Not Exist"
//             });
    
//           const isMatch = await bcrypt.compare(password, user.password);
//           if (!isMatch)
//             return res.status(400).json({
//               message: "Incorrect Password !"
//             });
    
//           const payload = {
//             user: {
//               id: user.id
//             }
//           };
    
//           let newStat = new Stat({
//             userId: user.id,
//           })
//           newStat.save()
//           .then(()=>{
            
//                   jwt.sign(
//                         payload,
//                         "secret",
//                         {
//                         expiresIn: 3600
//                         },
//                         (err, token) => {
//                         if (err) throw err;
//                         res.status(200).json({
//                         token
//                         });
//                         }
//                   );
            
//             })
//             .catch(() => {
//                   res.status(400).send({
//                         "error": "Error while saving session"
//                   } )
//             })
//         } catch (e) {
//           console.error(e);
//           res.status(500).json({
//             message: "Server Error"
//           });
//         }
//       }
//     );
    
router.get("/logout", authentication, async (req, res) => {
      try {
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