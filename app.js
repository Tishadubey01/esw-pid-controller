// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors= require("cors");
require("./models/User")
const app = express();
app.use(express.json());
app.use(cors());
app.use(require('./routes/auth'))

const dotenv = require('dotenv');
dotenv.config();

// Connect to the MongoDB
const url = process.env.MONGO_URI;
mongoose.connect(url, {
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

if (process.env.NODE_ENV == "production") {
    app.use(express.static("frontend/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    })
}



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});}
)
.catch((err) => console.log(err));