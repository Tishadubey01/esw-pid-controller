const mongoose=require('mongoose');
const bcrypt=require("bcrypt");
let schema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    loginTime: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model("stat",schema);