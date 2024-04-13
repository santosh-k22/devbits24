const CourseProgress = require("../models/courseProgress");
const Course = require("../models/course");
const User = require("../models/user");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2

const { convertSecondsToDuration } = require("../utils");

// Update
exports.updateUser = async (req, res) => {
    try {
        const {
            firstName = "",
            lastName = "",
            username, 
            userId
        } = req.body;
        // const userId = req.user.id;
        // const user = await User.find({
        //     username : username
        // });
        // const userId = user._id;
        // const displayPicture = req.files.displayPicture

        // Find and update user by id
        const updatedUser = await User.findByIdAndUpdate(userId, {
            firstName,
            lastName,
        }).exec();

        // Upload display picture to cloudinary
        if (displayPicture) {
            const image = await cloudinary.uploader
                .upload(
                    displayPicture,
                    {
                        folder: process.env.FOLDER_NAME,
                        public_id: displayPicture.name,
                        format: "jpg",
                        width: 1000,
                        height: 1000,
                    }
                )
            console.log(image)
            updatedUser.image = image.secure_url
        }

        await User.save()

        return res.json({
            success: true,
            message: "User details updated successfully",
            updatedUser,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        })
    }
}

// DELETE
exports.deleteUser = async (req, res) => {
    try {
        // const id = req.user.id
        const {
            username,
            userId
        } = req.body;
        // const userReq = await User.find({
        //     username : username
        // });
        const id = userId;

        const user = await User.findById({ _id: id });
        // Return error if user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        await User.findByIdAndDelete({ _id: id });

        // Delete enrolled courses and their progress
        for (const courseId of user.courses) {
            await Course.findByIdAndUpdate(
                courseId,
                { $pull: { studentsEnrolled: id } },
                { new: true }
            )
        }
        await CourseProgress.deleteMany({ userId: id })

        return res.json({
            success: true,
            message: "User deleted successfully",
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        })
    }
}

// READ User details
exports.userDetails = async (req, res) => {
    try {
        // const userId = req.user.id
        const {
            username,
            userId
        } = req.body;
        // const user = await User.find({
        //     username : username
        // });
        // const userId = user._id;
        const userDetails = await User.findById(userId)
            .populate("firstName")
            .populate("lastName")
            .populate("email")
            .populate("accountType")
            .populate("image")
            .exec();
        console.log(userDetails);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// READ Enrolled courses
exports.enrolledCourses = async (req, res) => {
    try {
        // const userId = req.user.id;
        const {
            username, 
            userId
        } = req.body;
        // const user = await User.find({
        //     username : username
        // });
        // const userId = user._id;

        let userDetails = await User.findOne({
            _id: userId,
        })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "courseSubContent",
                    },
                },
            })
            .exec();
        userDetails = userDetails.toObject();

        // TODO: Check how correct is this
        var SubsectionLength = 0
        for (let i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[
                    j
                ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                )
                SubsectionLength +=
                    userDetails.courses[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos.length
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                    Math.round(
                        (courseProgressCount / SubsectionLength) * 100 * multiplier
                    ) / multiplier
            }
        }

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// READ Course stats
exports.instructorDashboard = async (req, res) => {
    try {
        const {
            username,
            userId
        } = req.body;
        // const user = await User.find({
        //     username : username
        // });
        // const userId = user._id;
        // const courseDetails = await Course.find({ instructor: req.user.id })
        const courseDetails = await Course.find({ instructor: userId })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json({ courses: courseData })
    } catch (err) {
        console.error(err)
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error",
            error: err.message,
        })
    }
}