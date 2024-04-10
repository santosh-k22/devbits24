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
router.post("/create", isLoggedIn, isInstructor, createCourseSubContent);
router.post("/update", isLoggedIn, isInstructor, updateCourseSubContent);
router.post("/delete", isLoggedIn, isInstructor, deleteCourseSubContent);

module.exports = router;