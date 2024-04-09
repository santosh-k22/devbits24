const express = require("express");
const router = express.Router();

const {
    deleteUser,
    updateUser,
    userDetails,
    enrolledCourses,
    instructorDashboard,
} = require("../controllers/user");
const { isLoggedIn, isInstructor } = require("../middleware");

router.put("/update", isLoggedIn, updateUser);
router.delete("/delete", isLoggedIn, deleteUser);
router.get("/details", isLoggedIn, userDetails);
router.get("/enrolledCourses", isLoggedIn, enrolledCourses)
router.get("/instructorDashboard", isLoggedIn, isInstructor, instructorDashboard)

// router.delete("/deleteProfile", auth, deleteAccount)
// router.put("/update", auth, updateUser)
// router.get("/getUserDetails", auth, getAllUserDetails)
// router.get("/getEnrolledCourses", auth, getEnrolledCourses)
// router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router;