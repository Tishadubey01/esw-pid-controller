const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('mongoose-type-email');

let singleLoginSchema = new mongoose.Schema(
  {
    islogin:{
        type:Boolean,
        required: true,
        default: false
    }
  },{
    timestamps: true
});


module.exports = mongoose.model("singleLogin", singleLoginSchema);