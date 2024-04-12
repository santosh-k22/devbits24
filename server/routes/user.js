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

// router.put("/update", isLoggedIn, updateUser);
// router.delete("/delete", isLoggedIn, deleteUser);
// router.get("/details", isLoggedIn, userDetails);
// router.get("/enrolledCourses", isLoggedIn, enrolledCourses)
// router.get("/instructorDashboard", isLoggedIn, isInstructor, instructorDashboard)
router.put("/update", updateUser);
router.delete("/delete", isLodIn, deleteUser);
router.get("/details", userDetails);
router.get("/enrolledCourses", enrolledCourses)
router.get("/instructorDashboard", instructorDashboard)

module.exports = router;