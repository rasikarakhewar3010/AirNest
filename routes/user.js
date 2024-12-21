const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require('../controllers/users.js');



//signup ge and post routes
router.route("/signup")
.get(userController.renserSignup)
.post(wrapAsync(userController.signup));



//login ge and post routes
router.route("/login")
.get(userController.renderLogin)
.post(
    saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
   userController.login
);

router.get("/logout", userController.logout);

module.exports = router;
