const express = require("express");
const router = express.Router();

// Categories Controllers Import
const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
} = require("../controllers/category");
const { isLoggedIn, isInstructor, isAdmin } = require("../middleware");

// /category
router.post("/create", isLoggedIn, isAdmin, createCategory);
router.get("/", categoryPageDetails);
router.get("/showAll", showAllCategories);

module.exports = router;