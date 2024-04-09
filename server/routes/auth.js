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

// router.post("/sendotp", sendotp)
// router.post("/changepassword", auth, changePassword)
// router.post("/reset-password-token", resetPasswordToken)
// router.post("/reset-password", resetPassword)

module.exports = router;