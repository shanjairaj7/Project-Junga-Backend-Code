const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const ObjectId = mongoose.Types.ObjectId;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 40,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 100,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 4,
    required: true,
  },
  icon: {
    type: String,
    minlength: 5,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      name: this.name,
      id: this._id,
    },
    process.env.PRIVATE_KEY
  );

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
