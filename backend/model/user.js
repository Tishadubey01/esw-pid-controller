const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('mongoose-type-email');
var passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    }
  },{
    timestamps: true
});


userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
module.exports = mongoose.model("User", userSchema);