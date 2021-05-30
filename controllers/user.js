const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.signUp = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }

  //   Hash the password
  const hashPassword = (plainPassword, saveUser) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(plainPassword, salt, (err, hashedPassword) => {
        saveUser(hashedPassword);
      });
    });
  };

  //   Save the user to the database
  const saveUser = (hashedPassword) => {
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    // Check if the user already exists in the database
    User.find({ email: req.body.email }, (err, users) => {
      if (users.length > 0) {
        return res.status(409).json({
          error: "User already exists",
        });
      }

      newUser.save((err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Not able to Sign up user",
          });
        }

        const token = user.generateAuthToken();

        return res.status(200).json({
          token,
          message: "Successfully saved user",
          user,
        });
      });
    });
  };

  hashPassword(req.body.password, (hashedPassword) => {
    saveUser(hashedPassword);
    return;
  });
};

exports.signIn = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    bcrypt.compare(req.body.password, user.password, (err, passwordIsValid) => {
      if (!passwordIsValid) {
        return res.status(400).json({
          error: "Password does not match",
        });
      }

      const token = user.generateAuthToken();

      return res.status(200).json({
        token,
        message: "User successfully signed in",
        user,
      });
    });
  });
};
