const dotenv = require("dotenv");
const User = require("./models/user");
const Course = require("./models/course");
// Configuring dotenv to load environment variables from .env file
dotenv.config();

exports.isLoggedIn = (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            // Return error
            return res.status(401).json({
                success: false,
                message: "You are not logged in",
            });
        }
        next();
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "User Can't be determined whether logged in or not" });
    }
};

// Check if user is Student
exports.isStudent = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });

        if (userDetails.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Students",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
};

// Check if user is Admin
exports.isAdmin = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });

        if (userDetails.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Admin",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
};

// Check if user is Instructor
exports.isInstructor = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });
        console.log(userDetails);

        console.log(userDetails.accountType);

        if (userDetails.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Instructor",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
};

// Check if user is the instructor of course
exports.isCourseInstructor = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const userDetails = await User.findOne({ email: req.user.email });
        const courseDetails = await Course.findById(courseId);
        console.log(userDetails, courseDetails);

        if (userDetails._id !== courseDetails.instructor) {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Instructor of this Course",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
};