const express = require("express");
const router = express.Router();

// Rating Controllers Import
const {
    createRating,
    getAverageRating,
    getAllRating,
    updateRating,
    deleteRating,
} = require("../controllers/ratingAndReview");
const { isLoggedIn, isStudent } = require("../middleware");

// /course/:courseId/rating
// router.post("/create", isLoggedIn, isStudent, createRating);
// router.get("/average", isLoggedIn, getAverageRating);
// router.post("/update", isLoggedIn, isStudent, updateRating);
// router.post("/delete", isLoggedIn, isStudent, deleteRating);
// router.get("/", isLoggedIn, getAllRating);
router.post("/create", createRating);
router.get("/average", getAverageRating);
router.post("/update", updateRating);
router.post("/delete", deleteRating);
router.get("/", getAllRating);

module.exports = router;