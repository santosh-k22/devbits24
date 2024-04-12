const express = require("express");
const router = express.Router();

// Sections Controllers Import
const {
    createCourseContent,
    updateCourseContent,
    deleteCourseContent,
} = require("../controllers/courseContent");
const { isLoggedIn, isInstructor } = require("../middleware");

// /course/:courseId/   :courseContentId/
// router.post("/create", isLoggedIn, isInstructor, createCourseContent);
// router.post("/update", isLoggedIn, isInstructor, updateCourseContent);
// router.post("/delete", isLoggedIn, isInstructor, deleteCourseContent);
router.post("/create", createCourseContent);
router.post("/update", updateCourseContent);
router.post("/delete", deleteCourseContent);

module.exports = router;