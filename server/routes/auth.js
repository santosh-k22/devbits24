const express = require("express");
const router = express.Router();
// const passport = require("passport");

const {
    signup,
    login,
    logout,
    allUsers
} = require("../controllers/auth")

const { isLoggedIn } = require("../middleware")

// router.post("/login", passport.authenticate("local"), login);
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", isLoggedIn, logout);
router.get("/allUsers", allUsers);

module.exports = router;