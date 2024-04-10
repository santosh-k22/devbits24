const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
    signup,
    login,
    logout,
} = require("../controllers/auth")

const { isLoggedIn } = require("../middleware")

router.post("/login", passport.authenticate("local"), login);
router.post("/signup", signup);
router.post("/logout", isLoggedIn, logout);

module.exports = router;