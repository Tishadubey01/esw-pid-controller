const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const DB_NAME = "esw"

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/' + DB_NAME, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})

// routes
var UserRouter = require("./routes/auth");

// setup API endpoints
app.use("/user", UserRouter);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});











// // app.js

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// //const passport = require('passport');
// const cors = require('cors');
// //onst{MONGOURL}=require("./keys")
// require("./models/User")
// const app = express();
// //Middlewares
// app.use(express.json());
// app.use(cors());
// app.use(require('./routes/auth'))
// mongoose.connect("mongodb://localhost:27017/ews",{
//     useNewURLParser: true,
//     useUnifiedTopology: true,
//     // useCreateIndex: true,
//     // useFindAndModify:false,
// })
// .then((res) =>{ console.log("Connected to DB")
// // mongoose.connection.on("connected",()=>{
// //     console.log('Mongodb connected');
// //     console.log("connectionnn");
// // })
// // mongoose.connection.on("error",()=>{
// //     console.log("error")
// // })
// //app.use(bodyParser.urlencoded({ extended: false }));
// //app.use(bodyParser.json());

// var UserRouter = require("./routes/auth");
// app.use("/user", UserRouter);

// app.get('/', function(req, res) {
//     res.send('hello');
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server is running on PORT ${PORT}`);
// });}
// )
// .catch((err) => console.log(err));