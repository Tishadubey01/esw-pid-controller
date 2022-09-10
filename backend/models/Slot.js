const mongoose=require('mongoose');
const bcrypt=require("bcrypt");
let schema = new mongoose.Schema({
    order: {
        type: Number,
        required: true,
    },
    start:{
        type:String,
        required:true
    },
    end:{
        type:String,
        required:true
    },
    users: [
        {
            date: {
                type: Date,
                default: Date.now()
            },
            userId: {
                type: String,
                //required:true
            }
        }
    ]
});
module.exports = mongoose.model("slot", schema);