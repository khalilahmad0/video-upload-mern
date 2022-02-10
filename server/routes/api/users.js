const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../helpers/keys");

const validateRegisteer = require("../../helpers/validation/register");
const validateLogin = require("../../helpers/validation/login");

const User = require("../../models/User");

// Register Endpoint
// returns user
router.post("/register", (req, res) => {

  const { errors, isValid } = validateRegisteer(req.body);

  // If not valid
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists." });
    } else {
      const createdUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      // Hash password before saving in database
      bcrypt.genSalt((err, salt) => {
        bcrypt.hash(createdUser.password, salt, (err, hash) => {
          if (err) throw err;
          createdUser.password = hash;
          createdUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// Login endpoint
// returns token
router.post("/login", (req, res) => {

  const { errors, isValid } = validateLogin(req.body);

  // If not valid
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "Email was not found." });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926,
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ password: "Wrong password." });
      }
    });
  });
});

module.exports = router;
