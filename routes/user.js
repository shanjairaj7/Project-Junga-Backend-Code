const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { signUp, signIn } = require("../controllers/user");

// Authentication and Authorisation
router.post(
  "/user/signup",
  [
    check("name", "Name should be at least 3 characters").isLength({ min: 3 }),
    check("email", "Invalid email").isEmail(),
    check("password", "Password should be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  signUp
);
router.post(
  "/user/signin",
  [
    check("email", "Invalid email").isEmail(),
    check("password", "Password is required").isLength({
      min: 6,
    }),
  ],
  signIn
);

module.exports = router;
