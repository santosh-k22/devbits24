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
router.post("/updateCourseProgress", isLoggedIn, isStudent, updateCourseProgress);
router.post("/create", isLoggedIn, isInstructor, createCourse)
router.post("/update", isLoggedIn, isInstructor, updateCourse);
router.post("/delete", isLoggedIn, isInstructor, deleteCourse);
router.get("/userCourseDetails", isLoggedIn, isStudent, getUserCourseDetails);
router.get("/instructorCourses", isLoggedIn, isInstructor, getInstructorCourses);
router.get("/details", getCourseDetails);
router.get("/", getAllCourses);

// //               Course routes
// // Courses can Only be Created by Instructors
// router.post("/createCourse", auth, isInstructor, createCourse)
// router.get("/getAllCourses", getAllCourses)
// router.post("/getCourseDetails", getCourseDetails)
// router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// router.post("/editCourse", auth, isInstructor, editCourse)
// router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// router.delete("/deleteCourse", deleteCourse)

// //              Section
// router.post("/addSection", auth, isInstructor, createSection)
// router.post("/updateSection", auth, isInstructor, updateSection)
// router.post("/deleteSection", auth, isInstructor, deleteSection)

// //              Sub Section
// router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// router.post("/addSubSection", auth, isInstructor, createSubSection)

// //                      Category routes (Only by Admin)
// router.post("/createCategory", auth, isAdmin, createCategory);
// router.get("/showAllCategories", showAllCategories);
// router.post("/getCategoryPageDetails", categoryPageDetails);

// //                    Rating and Review
// router.post("/createRating", auth, isStudent, createRating)
// router.get("/getAverageRating", getAverageRating)
// router.get("/getReviews", getAllRating)

module.exports = router