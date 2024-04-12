const express = require("express");
const router = express.Router();

// Sub-Sections Controllers Import
const {
    createCourseSubContent,
    updateCourseSubContent,
    deleteCourseSubContent,
} = require("../controllers/courseSubContent");
const { isLoggedIn, isInstructor } = require("../middleware");

// /course/:courseId/:courseContentId/
// router.post("/create", isLoggedIn, isInstructor, createCourseSubContent);
// router.post("/update", isLoggedIn, isInstructor, updateCourseSubContent);
// router.post("/delete", isLoggedIn, isInstructor, deleteCourseSubContent);
router.post("/create", createCourseSubContent);
router.post("/update", updateCourseSubContent);
router.post("/delete", deleteCourseSubContent);

module.exports = router;