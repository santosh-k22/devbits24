const express = require("express");
const router = express.Router();

// Course Controllers Import
const {
    createCourse,
    updateCourse,
    getAllCourses,
    getCourseDetails,
    getUserCourseDetails,
    getInstructorCourses,
    deleteCourse,
} = require("../controllers/course");

const {
    updateCourseProgress
} = require("../controllers/courseProgress");

const { isLoggedIn, isInstructor, isStudent } = require("../middleware");

// Course routes
// router.post("/updateCourseProgress", isLoggedIn, isStudent, updateCourseProgress);
// router.post("/create", isLoggedIn, isInstructor, createCourse)
// router.post("/update", isLoggedIn, isInstructor, updateCourse);
// router.post("/delete", isLoggedIn, isInstructor, deleteCourse);
// router.get("/userCourseDetails", isLoggedIn, isStudent, getUserCourseDetails);
// router.get("/instructorCourses", isLoggedIn, isInstructor, getInstructorCourses);
// router.get("/details", getCourseDetails);
// router.get("/", getAllCourses);
router.post("/updateCourseProgress", updateCourseProgress);
router.post("/create", createCourse)
router.post("/update", updateCourse);
router.post("/delete", deleteCourse);
router.get("/userCourseDetails", getUserCourseDetails);
router.get("/instructorCourses", getInstructorCourses);
router.get("/details", getCourseDetails);
router.get("/", getAllCourses);

module.exports = router