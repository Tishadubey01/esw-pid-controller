// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const passport = require('passport');
const cors= require("cors");
//onst{MONGOURL}=require("./keys")
require("./models/User")
const app = express();
//Middlewares
app.use(express.json());
app.use(cors());
app.use(require('./routes/auth'))
mongoose.connect("mongodb://localhost:27017/ews",{
    useNewURLParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify:false,
})
.then((res) =>{ console.log("Connected to DB")
// mongoose.connection.on("connected",()=>{
//     console.log('Mongodb connected');
//     console.log("connectionnn");
// })
// mongoose.connection.on("error",()=>{
//     console.log("error")
// })
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('hello');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});}
)
.catch((err) => console.log(err));